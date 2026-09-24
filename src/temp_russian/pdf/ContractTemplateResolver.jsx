import React from "react";
import StandardContract from "./templates/standard/StandardContract";
import RussianContract from "./templates/russian/RussianContract";

/**
 * ContractTemplateResolver
 *
 * The single routing point between contract data and its PDF template.
 * Adding a new template = create a new component + add one case here.
 * Zero changes required to ContractViewModal or any other file.
 *
 * Props:
 *  - contract: full contract object from the API
 *  - renderValue(key, defaultValue): function from ContractViewModal that handles
 *    printOverrides and the inline "Customize" text editing mode
 */
import RussianSpecification from "./templates/russian/RussianSpecification";

export default function ContractTemplateResolver({ contract, renderValue, overrideFormat, isCustomizing }) {
  const format = (overrideFormat || contract?.contractFormat || "STANDARD").toUpperCase();

  switch (format) {
    case "RUSSIAN_SPEC":
      return <RussianSpecification contract={contract} renderValue={renderValue} isCustomizing={isCustomizing} />;

    case "RUSSIAN":
      return <RussianContract contract={contract} renderValue={renderValue} isCustomizing={isCustomizing} />;

    case "STANDARD":
    default:
      return <StandardContract contract={contract} renderValue={renderValue} isCustomizing={isCustomizing} />;
  }
}
