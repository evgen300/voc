import CategoriesSchema from "@/models/schemas/CategoriesSchema";

const getList = async function() {
  const words = await CategoriesSchema.find();

  return words;
}

export default {
  getList
}