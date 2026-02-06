---
description: Update the Academic Paper Repository with latest findings
---

# Update Paper Repository

This workflow finds new academic papers related to Red Roaches (Shelfordella lateralis) and exotic animal nutrition, and updates the `src/scripts/paper-data.js` file.

1. **Search for new papers**
   - Use `search_web` with queries like:
     - `"Shelfordella lateralis" nutrition scholarly`
     - `"Blatta lateralis" chemical composition`
     - `"Reptile nutrition" insects`
     - `"Exotic animal" insectivory`

2. **Extract Information**
   - For each relevant new paper found, extract:
     - **title**: Title of the paper (translate to Japanese if needed, or keep English with Japanese subtitle)
     - **author**: First author et al. and Year
     - **summary**: 3-line summary for breeders (Japanese)
     - **category**: e.g., "Nutrition", "Veterinary", "Environment"
     - **url**: Direct link to the paper/abstract

3. **Update Data File**
   - Read `src/scripts/paper-data.js`.
   - Prepend the new papers to the `PAPER_DATA` array.
   - Limit the total list if it gets too long (optional, keep top 20).
   - Use `replace_file_content` or `write_to_file` to save the updated list.

4. **Notify User**
   - Inform the user which papers were added.
