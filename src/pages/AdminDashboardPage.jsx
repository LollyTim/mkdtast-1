import React, { useContext, useState, useCallback, useEffect } from "react";
import { GlobalContext } from "../globalContext";
import { AiOutlineUser } from "react-icons/ai";
import { RxCaretDown } from "react-icons/rx";
import { FaArrowUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggableRow = ({ id, index, moveRow, children }) => {
  const [, ref] = useDrag({
    type: "row",
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: "row",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="w-full">
      {children}
    </div>
  );
};

const DraggableColumn = ({ id, index, moveColumn, children }) => {
  const [, ref] = useDrag({
    type: "column",
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: "column",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="flex-1">
      {children}
    </div>
  );
};

const AdminDashboardPage = () => {
  const { state, dispatch, fetchVideos } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [rows, setRows] = useState(state.videos);
  const [columns, setColumns] = useState([
    "#",
    "Title",
    "Author",
    "Most Liked",
  ]);

  useEffect(() => {
    fetchVideos(dispatch, state.currentPage);
  }, [dispatch, state.currentPage, fetchVideos]);

  useEffect(() => {
    setRows(state.videos);
  }, [state.videos]);

  const handleNext = () => {
    if (state.currentPage < state.totalPages) {
      fetchVideos(dispatch, state.currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (state.currentPage > 1) {
      fetchVideos(dispatch, state.currentPage - 1);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    window.location.reload();
  };

  const moveRow = useCallback(
    (fromIndex, toIndex) => {
      const updatedRows = [...rows];
      const [movedRow] = updatedRows.splice(fromIndex, 1);
      updatedRows.splice(toIndex, 0, movedRow);
      setRows(updatedRows);
    },
    [rows]
  );

  const moveColumn = useCallback(
    (fromIndex, toIndex) => {
      const updatedColumns = [...columns];
      const [movedColumn] = updatedColumns.splice(fromIndex, 1);
      updatedColumns.splice(toIndex, 0, movedColumn);
      setColumns(updatedColumns);
    },
    [columns]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex flex-col items-center bg-black font-[inter] h-full mb-5">
        <div className="w-[80%] h-14 px-4 py-2 flex flex-row mt-5 justify-between bg-black">
          <h1 className="text-4xl text-white font-bold">APP</h1>
          <AiOutlineUser />
          <button
            onClick={handleLogout}
            className="flex gap-1 px-2 bg-[#9BFF00] text-black font-thin justify-center items-center rounded-3xl w-50px]"
          >
            <AiOutlineUser size={15} className="font-thin inter" />
            <p className="">Logout</p>
          </button>
        </div>

        <div className="w-[80%] justify-between mt-20 flex items-center flex-row font-[inter]">
          <h1 className="text-3xl font-[inter] font-thin text-gray-100">
            Today's leaderboard
          </h1>
          <div className="flex items-center bg-[#1D1D1D] space-x-4 rounded-lg px-4 py-2">
            <span className="text-[#FFFFFF] text-xs font-thin">
              30 May 2022
            </span>
            <span className="w-1 h-1 text-sm text-white bg-[#696969] rounded-full"></span>
            <button className="bg-[#9BFF00] font-thin text-sm px-2 py-1 rounded-lg">
              SUBMISSIONS OPEN
            </button>
            <span className="w-1 h-1 text-sm text-white bg-[#696969] rounded-full font-thin"></span>
            <span className="text-white font-thin text-sm">11:34</span>
          </div>
        </div>

        <div className="w-[80%] flex-col text-white mt-4 font-[inter]">
          <div className="px-3 flex flex-row w-full font-[inter] justify-between items-start">
            {columns.map((column, index) => (
              <DraggableColumn
                key={index}
                id={index}
                index={index}
                moveColumn={moveColumn}
              >
                <div className="flex flex-row gap-5 font-[inter] text-sm font-thin text-[#666666]">
                  <p>{column}</p>
                </div>
              </DraggableColumn>
            ))}
          </div>

          {rows.map((video, index) => (
            <DraggableRow
              key={video.id}
              id={video.id}
              index={index}
              moveRow={moveRow}
            >
              <div className="w-full border mt-4 border-[#666666] border-opacity-50 px-3 py-2 grid grid-cols-3 justify-between rounded-lg">
                <div className="flex flex-row justify-center items-center gap-6">
                  <p className="text-sm font-thin text-[#666666]">
                    {index + 1}
                  </p>
                  <div
                    className="w-28 h-16 bg-gray-500 rounded-lg"
                    style={{
                      backgroundImage: `url(${video.photo})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <div className="w-60">
                    <p className="text-xs font-thin font-[inter] opacity-50">
                      {video.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <p className="font-thin font-[inter] text-xs opacity-50">
                    {video.username}
                  </p>
                </div>
                <div className="flex flex-row gap-1 justify-end items-center">
                  <p className="font-thin font-[inter] text-xs opacity-50">
                    {video.like}
                  </p>
                  <FaArrowUp size={15} color="#9BFF00" />
                </div>
              </div>
            </DraggableRow>
          ))}

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={state.currentPage === 1}
              className="bg-[#9BFF00] text-black px-4 py-2 rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={state.currentPage === state.totalPages}
              className="bg-[#9BFF00] text-black px-4 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdminDashboardPage;
