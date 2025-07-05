"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface MyEmojiPickerProps {
    onEmojiSelect?: (emoji: string) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MyEmojiPicker({onEmojiSelect, isOpen, onOpenChange} : MyEmojiPickerProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isPickerOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const setIsPickerOpen = onOpenChange || setInternalIsOpen;

  return (
      <Popover onOpenChange={setIsPickerOpen} open={isPickerOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile className="h-4 w-4"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }) => {
              setIsPickerOpen(false);
              if(onEmojiSelect){
                onEmojiSelect(emoji)
              }
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
  );
}