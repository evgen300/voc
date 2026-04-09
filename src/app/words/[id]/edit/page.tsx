import WordsEdit from "@/components/words/WordsEdit"

export default async function EditWordPage({params}: {
  params: any
}) {
  const wordId = (await params).id;
  return (
    <WordsEdit wordId={wordId}></WordsEdit>
  )
}