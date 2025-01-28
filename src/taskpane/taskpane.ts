/* global Word console */

export async function insertText(paper: object) {
  // Write text to the document.
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(`${paper["authors"]}, ${paper["year"]}`, Word.InsertLocation.end);
      body.insertParagraph(`${paper["authors"]}, "${paper["title"]}", ${paper["year"]}`, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
