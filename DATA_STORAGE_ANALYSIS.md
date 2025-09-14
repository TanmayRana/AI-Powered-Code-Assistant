# Data Storage & Fetch Operations Analysis

## Overview

This document provides a comprehensive analysis of how the explore-sheets page, questionService, and data storage system work together to fetch and store data from external APIs into MongoDB.

## Architecture Overview

```
External API (node.codolio.com)
    ↓
questionService (Data Processing)
    ↓
MongoDB Collections (Data Storage)
    ↓
API Routes (Data Serving)
    ↓
Redux Store (State Management)
    ↓
React Components (UI Display)
```

## Data Flow Analysis

### 1. External API Sources

- **Public Sheets API**: `https://node.codolio.com/api/question-tracker/v2/sheet/public/get-public-sheets`
- **Sheet Details API**: `https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/{slug}`

### 2. questionService Functions

#### `AllQuestions()`

- **Purpose**: Fetches and stores all unique questions from all public sheets
- **Process**:
  1. Fetches list of public sheet slugs
  2. For each slug, fetches sheet details and extracts questions
  3. Deduplicates questions by slug
  4. Stores unique questions in `Question` collection
- **Storage**: `Question` collection
- **Error Handling**: Handles duplicate key errors (11000)

#### `PostPublicSheets()`

- **Purpose**: Fetches and stores public sheet metadata
- **Process**:
  1. Fetches public sheets list
  2. Updates/inserts each sheet in `Sheet` collection
- **Storage**: `Sheet` collection
- **Upsert Strategy**: Uses `findOneAndUpdate` with `upsert: true`

#### `PostFullSheet()`

- **Purpose**: Fetches complete sheet data with questions
- **Process**:
  1. Fetches public sheets list
  2. For each sheet, fetches complete data (sheet + questions)
  3. Saves sheet to `Sheet` collection
  4. Saves complete data to `FullSheet` collection
- **Storage**: `Sheet` and `FullSheet` collections
- **Relationships**: Maintains sheet-question relationships

#### `getSheetData(slug)`

- **Purpose**: Fetches individual sheet data by slug
- **Process**: Direct API call to external service
- **Usage**: For on-demand sheet fetching

### 3. MongoDB Schema Structure

#### Question Collection

```javascript
{
  id: String,           // Platform-specific ID
  slug: String,         // Unique identifier
  platform: String,     // Source platform
  name: String,         // Question title
  description: String,  // Question description
  difficulty: String,   // Easy/Medium/Hard
  problemUrl: String,   // Link to problem
  topics: [String],     // Topic tags
  companyTags: [String], // Company tags
  verified: Boolean     // Verification status
}
```

#### Sheet Collection

```javascript
{
  slug: String,         // Unique identifier
  author: String,       // Sheet creator
  name: String,         // Sheet title
  description: String,  // Sheet description
  visibility: String,   // public/private
  followers: Number,    // Follower count
  tag: [String],        // Sheet tags
  banner: String,       // Banner image
  totalQuestions: Number, // Question count
  userSolved: Number,   // Solved count
  isFollowing: Boolean  // Following status
}
```

#### SheetQuestion Collection

```javascript
{
  sheetId: ObjectId,    // Reference to Sheet
  questionId: ObjectId, // Reference to Question
  topic: String,        // Topic classification
  subTopic: String,     // Subtopic classification
  title: String,        // Question title in sheet
  resource: String,     // Resource link
  session: String,      // Session identifier
  isPublic: Boolean,    // Public visibility
  popularSheets: [ObjectId], // Popular sheet references
  isSolved: Boolean,    // Solved status
  questionDocumentId: ObjectId // Document reference
}
```

#### FullSheet Collection

```javascript
{
  sheet: Sheet,         // Embedded sheet object
  questions: [SheetQuestion] // Array of sheet questions
}
```

### 4. API Routes

#### `/api/question`

- **Method**: GET
- **Function**: Calls `AllQuestions()` from questionService
- **Returns**: Array of all questions

#### `/api/publicSheetsWithQuestions`

- **Method**: GET
- **Function**: Comprehensive data fetching and storage
- **Process**:
  1. Fetches public sheets from external API
  2. Fetches questions for each sheet
  3. Saves sheets to `Sheet` collection
  4. Saves questions to `Question` collection
  5. Creates `SheetQuestion` relationships
- **Returns**: Sheets and sheetQuestions data

#### `/api/sheet/[slug]`

- **Method**: GET
- **Function**: Fetches individual sheet with questions
- **Process**:
  1. Checks MongoDB for cached data
  2. Falls back to external API if not found
- **Returns**: Sheet with populated questions

#### `/api/question/[id]`

- **Method**: PATCH
- **Function**: Updates question solved status
- **Process**: Updates `isSolved` field in `SheetQuestion` collection

### 5. Redux Integration

#### sheetSlice

- **State Structure**:
  ```javascript
  {
    sheets: Sheet[],
    questions: Question[],
    sheetQuestions: SheetQuestion[],
    currentSheet: Sheet | null,
    currentQuestions: Question[],
    loading: boolean,
    error: string | null
  }
  ```

#### Async Thunks

- `fetchPublicSheets`: Calls `/api/publicSheetsWithQuestions`
- `fetchAllQuestions`: Calls `/api/question`
- `fetchSheetBySlug`: Calls `/api/sheet/[slug]`
- `updateQuestionStatus`: Calls `/api/question/[id]`

### 6. Data Storage Operations

#### Fetch & Save Process

1. **External API Call**: Fetch data from node.codolio.com
2. **Data Processing**: Transform and validate data
3. **Deduplication**: Remove duplicate questions by slug
4. **MongoDB Storage**: Save to appropriate collections
5. **Relationship Creation**: Link sheets to questions
6. **Error Handling**: Handle duplicates and connection issues

#### Storage Strategies

- **Upsert Operations**: Use `findOneAndUpdate` with `upsert: true`
- **Duplicate Handling**: Handle MongoDB duplicate key errors (11000)
- **Batch Operations**: Use `insertMany` for bulk inserts
- **Population**: Use `populate()` for relationship queries

### 7. Error Handling

#### questionService Errors

- **Network Errors**: Try-catch blocks around fetch operations
- **Duplicate Errors**: Handle MongoDB duplicate key errors
- **Validation Errors**: Schema validation on insert operations

#### API Route Errors

- **Connection Errors**: MongoDB connection failures
- **Not Found Errors**: Missing data scenarios
- **Validation Errors**: Invalid request parameters

### 8. Performance Considerations

#### Optimization Strategies

- **Parallel Fetching**: Use `Promise.all()` for concurrent API calls
- **Caching**: Store data in MongoDB for faster subsequent access
- **Deduplication**: Avoid storing duplicate questions
- **Pagination**: Consider pagination for large datasets

#### Monitoring

- **Operation Logging**: Console logs for successful operations
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Track operation execution times

## Usage Examples

### Fetch All Data

```javascript
// Fetch and store all data
await PostPublicSheets(); // Store sheet metadata
await AllQuestions(); // Store all questions
await PostFullSheet(); // Store complete sheets with questions
```

### Individual Operations

```javascript
// Fetch specific sheet
const sheetData = await getSheetData("leetcode-top-100");

// Fetch all questions
const questions = await AllQuestions();
```

### Redux Usage

```javascript
// In React component
const dispatch = useDispatch();
const { sheets, questions, loading, error } = useSelector(
  (state) => state.sheets
);

// Fetch data
useEffect(() => {
  dispatch(fetchPublicSheets());
  dispatch(fetchAllQuestions());
}, [dispatch]);
```

## Conclusion

The data storage system provides a robust, scalable solution for fetching and storing coding practice data. It handles:

- ✅ **Data Fetching**: From external APIs
- ✅ **Data Processing**: Deduplication and transformation
- ✅ **Data Storage**: MongoDB with proper schemas
- ✅ **Data Serving**: RESTful API routes
- ✅ **State Management**: Redux integration
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Performance**: Optimized operations and caching

The system is designed to be maintainable, scalable, and user-friendly, providing a solid foundation for the coding practice platform.
