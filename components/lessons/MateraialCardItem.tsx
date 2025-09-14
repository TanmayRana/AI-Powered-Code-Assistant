// "use client";

// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { RefreshCcw } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { toast } from "sonner";
// import { Card, CardContent } from "../ui/card";

// interface MaterialCardItemProps {
//   item: {
//     type: string;
//     name: string;
//     desc?: string;
//     link?: string;
//     image?: string;
//   };
//   studyTypeContent: Record<string, any[]>;
//   course: any; // Replace with proper type if available
//   refreshData: (refresh: boolean) => void;
// }

// const MaterialCardItem: React.FC<MaterialCardItemProps> = ({
//   item,
//   studyTypeContent,
//   course,
//   refreshData,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const isEmpty =
//     !studyTypeContent?.[item.type] || studyTypeContent[item.type].length === 0;

//   const GenerateContent = async () => {
//     toast("Generating content, please wait...");
//     setLoading(true);
//     try {
//       const chapters =
//         course?.lessons?.[0]?.chapters
//           ?.map((chapter: any) => chapter.chapterTitle)
//           .join(", ") || "";

//       await axios.post(`/api/generate-study-type-content`, {
//         lessonId: course?._id,
//         studyType: item.type,
//         chapters,
//       });

//       refreshData(true);
//       toast.success("Content generated successfully");
//     } catch (error) {
//       console.error("Error generating content:", error);
//       toast.error("Failed to generate content");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className=" shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900 border">
//       <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
//             isEmpty ? "bg-gray-500 text-white" : "bg-green-500 text-white"
//           }`}
//         >
//           {isEmpty ? "Generate" : "Ready"}
//         </span>

//         <div className="">
//           <Image
//             src={item.image || "/placeholder.png"}
//             alt={item.name}
//             width={60}
//             height={60}
//             className="rounded-full shadow-sm"
//           />
//         </div>

//         <h2 className="font-semibold text-lg">{item.name}</h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400">
//           {item.desc || "No description available"}
//         </p>

//         {isEmpty ? (
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={GenerateContent}
//             disabled={loading}
//             className="flex items-center gap-2 w-full"
//           >
//             {loading && <RefreshCcw className="animate-spin w-4 h-4" />}
//             {loading ? "Generating..." : "Generate"}
//           </Button>
//         ) : (
//           <Link
//             href={`/lessons/${course?._id}/${item.link}`}
//             className="w-full"
//           >
//             <Button
//               variant="default"
//               size="sm"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               View
//             </Button>
//           </Link>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default MaterialCardItem;

"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";

interface MaterialCardItemProps {
  item: {
    type: string;
    name: string;
    desc?: string;
    link?: string;
    image?: string;
  };
  studyTypeContent: Record<string, any[]>;
  course: any; // Consider defining a proper type instead of any
  refreshData: (refresh: boolean) => void;
}

const MaterialCardItem: React.FC<MaterialCardItemProps> = ({
  item,
  studyTypeContent,
  course,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);

  // Determine if content exists for this study type
  const isEmpty =
    !studyTypeContent?.[item.type] || studyTypeContent[item.type].length === 0;

  // Improved image source with fallback to avoid broken images
  const imageSrc = item.image || "/placeholder.png";

  const GenerateContent = async () => {
    toast("Generating content, please wait...");
    setLoading(true);
    try {
      const chapters =
        course?.lessons?.[0]?.chapters
          ?.map((chapter: any) => chapter.chapterTitle)
          .join(", ") || "";

      await axios.post(`/api/generate-study-type-content`, {
        lessonId: course?._id,
        studyType: item.type,
        chapters,
      });
      refreshData(true);
      toast.success("Content generated successfully");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900 border">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
            isEmpty ? "bg-gray-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isEmpty ? "Generate" : "Ready"}
        </span>

        {/* Image with alt text and optimized loading */}
        <div className="relative w-16 h-16 rounded-md shadow-sm overflow-hidden">
          <Image
            src={imageSrc}
            alt={`Image of ${item.name}`}
            layout="fill"
            objectFit="cover"
            priority={true}
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </div>

        <h2 className="font-semibold text-lg">{item.name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.desc || "No description available"}
        </p>

        {isEmpty ? (
          <Button
            variant="outline"
            size="sm"
            onClick={GenerateContent}
            disabled={loading}
            className="flex items-center gap-2 w-full justify-center"
          >
            {loading && <RefreshCcw className="animate-spin w-4 h-4" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        ) : (
          <Link
            href={`/lessons/${course?._id}/${item.link}`}
            className="w-full"
          >
            <Button
              variant="default"
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialCardItem;
