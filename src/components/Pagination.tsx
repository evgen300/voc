import { PaginationInterface } from "@/context/modules/WordsContext";

interface PaginationPropsInterface {
  pagination: PaginationInterface,
  action: Function
};

export default function Pagination(props: PaginationPropsInterface) {
  const { pagination, action } = props;

  return (
    <>
      { pagination.pages > 1 ? (
        <div className="items-pagination">
          <ul>
            { Array.from({ length: pagination.pages }).map((pageNum, pageIdx) => {
              return (
                <li key={ pageIdx } className={"page " + (pageIdx + 1 === pagination.page ? "-current" : "")} onClick={(e) => action(pageIdx + 1)}>
                  <span>{ pageIdx + 1 }</span>
                </li>
              )
            }) }
          </ul>
        </div>
      ) : '' }
    </>
  )
}