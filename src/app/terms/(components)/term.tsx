import path from "path";
import React from "react";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import TermTemplate from "./term-template";

const Term = async ({ termType, date }: any) => {
  const postsDirectory = path.join(process.cwd(), "public", "terms", termType);

  // Get all .md files in the directory
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  // If no date is provided, find the latest .md file
  if (!date) {
    date = fileNames
      .map((fileName) => fileName.replace(/\.md$/, ""))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  }

  const fullPath = path.join(postsDirectory, `${date}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Generate links to all .md files in the directory, excluding the current date
  const links = fileNames
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .filter((fileDate) => fileDate !== date)
    .map((fileDate) => (
      <div key={fileDate}>
        <a href={`/terms/${termType}/${fileDate}`}>{fileDate} 바로가기</a>
      </div>
    ));

  return <TermTemplate contentHtml={contentHtml} links={links} />;
};

export default Term;
