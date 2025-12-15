import React from "react";
import type { StructureBuilder } from "sanity/structure";
import { HomeIcon } from "@sanity/icons";

export const HOME_PAGE_DOCUMENT_ID = "homePage";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId(HOME_PAGE_DOCUMENT_ID)
            .title("Home Page"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "homePage"),
    ]);

