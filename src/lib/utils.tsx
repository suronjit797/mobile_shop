import { clsx, type ClassValue } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const globalModalProps = {
  title: "Are you sure?",
  okText: "Confirm",
  cancelText: "Cancel",
  okButtonProps: { style: { order: 1 } },
  cancelButtonProps: { style: { order: 2 }, className: "!bg-gray-300 !text-black hover:!bg-gray-400 px-6" },
  footer: (originNode: ReactNode) => <div className="flex justify-end gap-x-2">{originNode}</div>,
  closable: true,
  maskClosable: true,
  centered: true,
};
