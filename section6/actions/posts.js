"use server";
import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
const isInValidContent = (content) => {
  return !content || title.trim().length === 0;
};

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");
  let errors = [];
  if (isInValidContent(title)) {
    errors.push("Title is required");
  }
  if (isInValidContent(content)) {
    errors.push("Contents is required");
  }
  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length) {
    return { errors };
  }
  await storePost({
    imageUrl: "",
    title,
    content,
    userId: 1,
  });
  redirect("/feed");
}
