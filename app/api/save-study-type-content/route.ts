import StudyTypeContents from "@/lib/MongoSchemas/studyTypeContents";

export async function POST(request: Request) {
  try {
    const { courseId, studyType, aiResult, recordId } = await request.json();

    if (!courseId || !studyType || !aiResult) {
      return Response.json(
        { error: "courseId, studyType, and aiResult are required" },
        { status: 400 }
      );
    }

    // Use recordId if provided, otherwise fall back to courseId
    const recordToUpdate = recordId || courseId;

    const studyTypeRecord = await StudyTypeContents.findById(recordToUpdate);

    if (!studyTypeRecord) {
      return Response.json(
        {
          error: "Study type content record not found",
          details: `No record found with ID: ${recordToUpdate}`,
        },
        { status: 404 }
      );
    }

    // Update the record with the generated content
    studyTypeRecord.studyType = studyType;
    studyTypeRecord.content = aiResult;
    studyTypeRecord.status = "ready"; // Mark as ready
    studyTypeRecord.updatedAt = new Date();

    await studyTypeRecord.save();

    // console.log(
    //   `Study type content saved successfully for record: ${recordToUpdate}`
    // );

    return Response.json({
      message: "Study type content saved successfully",
      record: studyTypeRecord,
    });
  } catch (error: any) {
    console.error("Error saving study type content:", error);
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
