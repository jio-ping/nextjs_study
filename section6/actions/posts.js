"use server";
import { storePost } from "@/lib/posts";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/cloudinary";
import { updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";

const isInValidContent = (content) => {
  return !content || content.trim().length === 0;
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
  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later"
    );
  }
  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });
  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
