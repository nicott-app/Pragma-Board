const fs=require("fs");const c=fs.readFileSync("modal_template.txt","utf8");fs.writeFileSync("src/presentation/components/project/PbipDocumentationModal.tsx",c,"utf8");console.log("ok",c.length);
