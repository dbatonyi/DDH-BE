const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

var exports = (module.exports = {});

exports.apiTaskManagerForm = async function (req, res) {
  const { title, packages } = req.body;
  console.log(req.body);

  async function generateTrelloTask() {
    const getAllBoard = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`
    );
    const boardsData = await getAllBoard.data;

    const checkBoardExist = boardsData.find(
      (board) => board.name === config.TRELLO_BOARD_NAME
    );

    if (checkBoardExist) {
      checkBoardList(boardsData);
    } else {
      createNewBoard();
    }
  }

  async function createNewBoard() {
    const createBoard = await axios.post(
      `https://api.trello.com/1/boards?key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name: config.TRELLO_BOARD_NAME,
        desc: "This is a board for DDH Project",
      }
    );

    console.log("Board created");
  }

  async function checkBoardList(boardsData) {
    const getBoardId = boardsData
      .filter((x) => x.name === config.TRELLO_BOARD_NAME)
      .map((x) => {
        return x.id;
      });

    const getBoardList = await axios.get(
      `https://api.trello.com/1/boards/${getBoardId[0]}/lists?key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`
    );
    const boardListData = await getBoardList.data;

    const checkListExist = boardListData.find(
      (board) => board.name === config.TRELLO_LIST_NAME
    );

    if (checkListExist) {
      const getListId = boardListData
        .filter((x) => x.name === config.TRELLO_LIST_NAME)
        .map((x) => {
          return x.id;
        });

      createNewCard(getListId);
    } else {
      createNewList(getBoardId);
    }
  }

  async function createNewList(getBoardId) {
    const listName = config.TRELLO_LIST_NAME;
    const createList = await axios.post(
      `https://api.trello.com/1/boards/${getBoardId[0]}/lists?name=${listName}&key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`
    );

    console.log("List created");
  }

  async function createNewCard(getListId) {
    const createCard = await axios.post(
      `https://api.trello.com/1/cards/?idList=${getListId[0]}&key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name: title,
        desc: "random task desc",
      }
    );

    const cardData = await createCard.data;

    const getCardId = cardData.id;

    console.log("Card created");

    createChecklist(getCardId);
  }

  async function createChecklist(getCardId) {
    const createChecklist = await axios.post(
      `https://api.trello.com/1/cards/${getCardId}/checklists?key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name: "Checklist",
      }
    );

    const checklistData = await createChecklist.data;

    const getChecklistId = checklistData.id;

    console.log("Checklist created");

    createChecklistItem(getChecklistId);
  }

  async function createChecklistItem(getChecklistId) {
    const createChecklistItem = await axios.post(
      `https://api.trello.com/1/checklists/${getChecklistId}/checkItems?name={name}&key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name: "Checklist item",
      }
    );

    const checklistItemData = await createChecklistItem.data;

    console.log("Checklist item created: ", checklistItemData);
  }

  generateTrelloTask();

  res.status(200).send({ message: "Your form successfully accepted!" });
};
