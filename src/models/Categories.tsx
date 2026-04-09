import CategoriesSchema from "@/models/schemas/CategoriesSchema";

const getList = async function() {
  const words = await CategoriesSchema.find().sort("name");

  return words;
}

export default {
  getList
}