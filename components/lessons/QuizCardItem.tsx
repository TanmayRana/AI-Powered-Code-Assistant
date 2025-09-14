"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const QuizCardItem = ({ item, userSelectedOption }: any) => {
  const [optionid, setLocalOptionId] = useState("");

  // Reset selected option when question changes
  useEffect(() => {
    setLocalOptionId("");
  }, [item?.index]);

  if (!item) return null;

  const handleChange = (value: any) => {
    setLocalOptionId(value);
    const selectedOption = item.options.find((opt: any) => opt.id === value);
    if (selectedOption) {
      userSelectedOption(selectedOption);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 shadow-xl dark:shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] dark:hover:shadow-purple-500/10">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent dark:from-blue-300/20 rounded-full -translate-y-16 translate-x-16" />

      <div className="relative p-8">
        {/* Question header with enhanced typography */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight text-balance">
            {item.question}
          </h2>
        </div>

        {/* Enhanced options with better visual hierarchy */}
        <div className="space-y-3">
          <RadioGroup
            value={optionid}
            onValueChange={handleChange}
            defaultValue=""
            className="space-y-3"
          >
            {item.options.map((option: any, index: any) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  optionid === option.id
                    ? "border-blue-500 dark:border-blue-400 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 text-white shadow-lg scale-[1.02]"
                    : "border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:scale-[1.01]"
                }`}
              >
                {/* Option background effects */}
                {optionid === option.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />
                )}

                <div className="relative flex items-center p-4">
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="peer hidden"
                  />
                  <Label
                    htmlFor={option.id}
                    className="w-full cursor-pointer flex items-center gap-4"
                  >
                    {/* Custom radio indicator */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        optionid === option.id
                          ? "border-white bg-white/20 text-white"
                          : "border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 group-hover:border-blue-500 dark:group-hover:border-blue-400"
                      }`}
                    >
                      {option.id}
                    </div>

                    {/* Option text */}
                    <span
                      className={`font-medium transition-colors duration-300 ${
                        optionid === option.id
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                      }`}
                    >
                      {option.text}
                    </span>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default QuizCardItem;
