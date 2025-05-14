/* global Word console */

/*
export async function insertText(paper: any) {
  // Write text to the document.fe
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      const authorsFormatted = paper.authors.map( author => `${author?.FamilyName}, ${author?.GivenName[0]}. `)

      body.insertParagraph(`${authorsFormatted}, ${paper["year"]}`, Word.InsertLocation.end);
      body.insertParagraph(`${authorsFormatted}, "${paper["title"]}", ${paper["year"]}`, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
*/
