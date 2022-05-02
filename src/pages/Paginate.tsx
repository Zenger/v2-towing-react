import {useState} from "react";

const Paginate = (props: any) => {
    //<Pagination defaultCurrent={parseInt(totalPages)} defaultPageSize={25} current={parseInt(page)} total={totalPages} showSizeChanger={false} onChange={changePage} />

    const [isPrevVisible, setPrevVisible] = useState( props.prevVisible || false );
    const [isNextVisible, setNextVisible] = useState(props.nextVisible || false );
    const [totalItems, setTotalItems] = useState( props.totalItems || false );
    const [currentPage, setCurrentPage] = useState( props.currentPage || false );
    const [itemsPerPage, setItemsPerPage] = useState( props.itemsPerPage || 5);



    return;
}
export default Paginate;