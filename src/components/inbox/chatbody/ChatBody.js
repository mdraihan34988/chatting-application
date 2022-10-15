// import Blank from "./Blank";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { messagesApi, useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";

export default function ChatBody() {
    const { id } = useParams();
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetMessagesQuery(id) || {};

    const dispatch = useDispatch();

    const { data: messages, totalCount} = data || {} ;

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMore = () => {
        
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        if (page > 1) {
            dispatch(
                messagesApi.endpoints.getMoreMessages.initiate({
                    id,
                    page,
                })
            );
        }
    }, [page, dispatch, id]);

    useEffect(() => {

        if (totalCount > 0) {
            const more =
                Math.ceil(
                    totalCount /
                        Number(process.env.REACT_APP_MESSAGES_PER_PAGE)
                ) > page;

            setHasMore(more);
        }
    }, [totalCount, page]);

    // decide what to render
    let content = null;

    if (isLoading) {
        content = <div>Loading...</div>;
    } else if (!isLoading && isError) {
        content = (
            <div>
                <Error message={error?.data} />
            </div>
        );
    } else if (!isLoading && !isError && messages?.length === 0) {
        content = <div>No messages found!</div>;
    } else if (!isLoading && !isError && messages?.length > 0) {
        content = (
            <>
                <ChatHead message={messages[0]} />
                    <Messages messages={messages} hasMore={hasMore} fetchMore={fetchMore}/>
                <Options info={messages[0]} />
            </>
        );
    }

    return (
        <div className="w-full lg:col-span-2 lg:block">
            <div className="w-full grid conversation-row-grid">{content}</div>
        </div>
    );
}
