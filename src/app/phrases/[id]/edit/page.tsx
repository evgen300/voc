import PhrasesEdit from "@/components/phrases/PhrasesEdit";

export default async function EditPhrasePage({params}: {
  params: any
}) {
  const phraseId = (await params).id;
  return (
    <PhrasesEdit phraseId={phraseId}></PhrasesEdit>
  )
}