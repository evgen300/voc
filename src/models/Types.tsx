import TypesSchema from "@/models/schemas/TypesSchema";

const getList = async function() {
  const words = await TypesSchema.find();

  return words;
}

export default {
  getList
}