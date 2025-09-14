"use server";

import connectDB from "./mongodb";
import FullSheet from "./MongoSchemas/publicSheet";
import Question from "./MongoSchemas/Question";
import Sheet from "./MongoSchemas/Sheet";
// import SheetQuestion from "./MongoSchemas/SheetQuestion";
// import { FullSheet } from "./MongoSchemas/publicSheet";

// Ensure DB connection

// -------------------- Helper Functions --------------------
export const getQuestionCount = async () => {
  await connectDB();
  try {
    const count = await Question.countDocuments();
    console.log("Total questions in database:", count);
    return count;
  } catch (error) {
    console.error("Error getting question count:", error);
    return 0;
  }
};

export const getSampleQuestions = async (limit = 5) => {
  await connectDB();
  try {
    const questions = await Question.find({}).limit(limit).lean();
    console.log("Sample questions:", questions);
    return questions;
  } catch (error) {
    console.error("Error getting sample questions:", error);
    return [];
  }
};

export const removeDuplicateQuestions = async () => {
  await connectDB();
  try {
    console.log("Starting duplicate removal process...");

    // Find duplicates by slug
    const duplicates = await Question.aggregate([
      {
        $group: {
          _id: "$slug",
          count: { $sum: 1 },
          docs: { $push: "$_id" },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    console.log(`Found ${duplicates.length} duplicate groups`);

    let removedCount = 0;
    for (const duplicate of duplicates) {
      // Keep the first document, remove the rest
      const docsToRemove = duplicate.docs.slice(1);
      const result = await Question.deleteMany({
        _id: { $in: docsToRemove },
      });
      removedCount += result.deletedCount;
      console.log(
        `Removed ${result.deletedCount} duplicates for slug: ${duplicate._id}`
      );
    }

    console.log(`Total duplicates removed: ${removedCount}`);
    return { removedCount, duplicateGroups: duplicates.length };
  } catch (error) {
    console.error("Error removing duplicates:", error);
    throw error;
  }
};

export const getAllQuestionsStats = async () => {
  await connectDB();
  try {
    const totalCount = await Question.countDocuments();
    const uniqueSlugs = await Question.distinct("slug");
    const platforms = await Question.distinct("platform");
    const difficulties = await Question.distinct("difficulty");

    const stats = {
      totalQuestions: totalCount,
      uniqueSlugs: uniqueSlugs.length,
      platforms: platforms,
      difficulties: difficulties,
      duplicates: totalCount - uniqueSlugs.length,
    };

    console.log("Question statistics:", stats);
    return stats;
  } catch (error) {
    console.error("Error getting question stats:", error);
    throw error;
  }
};

// -------------------- Fetch and Save All Questions --------------------
export const AllQuestions = async () => {
  await connectDB();
  try {
    console.log("Starting AllQuestions fetch...");

    const res = await fetch(
      "https://node.codolio.com/api/question-tracker/v2/sheet/public/get-public-sheets"
    );
    const data = await res.json();
    console.log("Public sheets response:", data);

    const sheetSlugs = data.data.map((sheet: any) => sheet.slug);
    console.log("Found sheet slugs:", sheetSlugs.length);

    const fullSheetData = await Promise.all(
      sheetSlugs.map(async (slug: string) => {
        try {
          const res = await fetch(
            `https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/${slug}`
          );
          const sheetData = await res.json();
          console.log(
            `Sheet ${slug} questions:`,
            sheetData.data?.questions?.length || 0
          );
          return sheetData.data?.questions || [];
        } catch (error) {
          console.error(`Error fetching sheet ${slug}:`, error);
          return [];
        }
      })
    );

    const allQuestions = fullSheetData.flat();
    console.log("Total questions found:", allQuestions.length);

    // Extract question objects safely - check the actual structure
    const allQuestionIds = allQuestions
      .map((q) => {
        // Handle different possible structures
        if (q.questionId) {
          return q.questionId;
        } else if (q.id || q.slug) {
          return q; // Direct question object
        }
        return null;
      })
      .filter((q) => q && (q.slug || q.id));

    console.log("Valid question objects:", allQuestionIds.length);

    // Deduplicate by slug or id
    const uniqueQuestionsMap = new Map();
    allQuestionIds.forEach((q) => {
      const key = q.slug || q.id;
      if (key) {
        uniqueQuestionsMap.set(key, q);
      }
    });
    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

    console.log(
      "Unique questions after deduplication:",
      uniqueQuestions.length
    );

    // Validate question structure before inserting
    const validQuestions = uniqueQuestions.filter((q) => {
      return q && (q.slug || q.id) && q.name && q.platform;
    });

    console.log("Valid questions for insertion:", validQuestions.length);

    if (validQuestions.length === 0) {
      console.warn("No valid questions found to insert");
      return [];
    }

    // Insert/Update with proper duplicate handling using upsert
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    try {
      // Process each question individually with upsert to handle duplicates properly
      for (const question of validQuestions) {
        try {
          const result = await Question.findOneAndUpdate(
            { slug: question.slug }, // Use slug as unique identifier
            question,
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );

          if (result.isNew) {
            insertedCount++;
          } else {
            updatedCount++;
          }
        } catch (individualError: any) {
          if (individualError.code === 11000) {
            // Handle case where slug might not be unique
            const result = await Question.findOneAndUpdate(
              { id: question.id, platform: question.platform }, // Alternative unique key
              question,
              {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
              }
            );

            if (result.isNew) {
              insertedCount++;
            } else {
              updatedCount++;
            }
          } else {
            console.error(
              `Error processing question ${question.slug || question.id}:`,
              individualError
            );
            skippedCount++;
          }
        }
      }

      console.log(`Questions processed successfully:`);
      console.log(`- New questions inserted: ${insertedCount}`);
      console.log(`- Existing questions updated: ${updatedCount}`);
      console.log(`- Questions skipped due to errors: ${skippedCount}`);

      // Get final count
      const finalCount = await Question.countDocuments();
      console.log(`Total questions in database: ${finalCount}`);

      return {
        inserted: insertedCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: finalCount,
        processed: validQuestions.length,
      };
    } catch (err: any) {
      console.error("Error in question processing:", err);
      throw err;
    }
  } catch (err) {
    console.error("Error in AllQuestions:", err);
    throw err;
  }
};

// -------------------- Fetch and Save Full Sheets --------------------
export const PostFullSheet = async () => {
  await connectDB();
  try {
    const res = await fetch(
      "https://node.codolio.com/api/question-tracker/v2/sheet/public/get-public-sheets"
    );

    const data = await res.json();

    const sheetSlugs = data.data.map((sheet: any) => sheet.slug);

    const fullSheetData = await Promise.all(
      sheetSlugs.map(async (slug: string) => {
        const res = await fetch(
          `https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/${slug}`
        );
        const sheetData = await res.json();
        return sheetData.data; // { sheet, questions }
      })
    );

    for (const item of fullSheetData) {
      // First, save/update the sheet
      const sheet = await Sheet.findOneAndUpdate(
        { slug: item.sheet.slug },
        item.sheet,
        { upsert: true, new: true }
      );

      // Then save/update the full sheet with questions
      // await FullSheet.findOneAndUpdate(
      //   { "sheet.slug": item.sheet.slug },
      //   {
      //     sheet: sheet,
      //     questions: item.questions || [],
      //   },
      //   { upsert: true, new: true }
      // );
      const existingFullSheet = await FullSheet.findOne({
        "sheet.slug": item.sheet.slug,
      });

      if (!existingFullSheet) {
        // If not exists, create a new FullSheet
        await FullSheet.create({
          sheet: sheet,
          questions: item.questions || [],
        });
      } else {
        // (optional) If you also want to update when already exists
        await FullSheet.findOneAndUpdate(
          { "sheet.slug": item.sheet.slug },
          {
            sheet: sheet,
            questions: item.questions || [],
          },
          { new: true }
        );
      }
    }

    console.log("All public sheets updated successfully!");
    return fullSheetData;
  } catch (err) {
    console.error("Error in PostFullSheet:", err);
    throw err;
  }
};

// -------------------- Save or Update Public Sheets --------------------
export const PostPublicSheets = async () => {
  try {
    await connectDB();

    const response = await fetch(
      "https://node.codolio.com/api/question-tracker/v2/sheet/public/get-public-sheets"
    );

    if (!response.ok) throw new Error("Failed to fetch public sheets.");

    const result = await response.json();
    // if (!result.data || !result.data.sheets)
    //   throw new Error("No public sheet data received.");

    const sheetsData = result.data;

    for (const sheet of sheetsData) {
      await Sheet.findOneAndUpdate({ slug: sheet.slug }, sheet, {
        upsert: true,
        new: true,
      });
    }

    console.log("All public sheets saved/updated successfully!");
    return sheetsData;
  } catch (err) {
    console.error("Error in PostPublicSheets:", err);
    throw err;
  }
};

// -------------------- Get Sheet by Slug --------------------
export const getSheetData = async (slug: string) => {
  try {
    const response = await fetch(
      `https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/${slug}`
    );
    if (!response.ok) throw new Error("Failed to fetch sheet data.");

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error in getSheetData:", err);
    throw err;
  }
};
