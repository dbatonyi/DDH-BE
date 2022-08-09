const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

var exports = (module.exports = {});

exports.apiTaskManagerForm = async function (req, res) {
  const { title, dUpdate, packages } = req.body;
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

    generateTrelloTask();
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

      if (dUpdate === "true") {
        createNewCard(getListId, "Drupal update");
      }

      if (packages !== "") {
        createNewCard(getListId, "Install/Config Drupal");

        switch (packages) {
          case "basic":
            createNewCard(getListId, "Basic Package");
            break;
          case "flexi":
            createNewCard(getListId, "Flexi Package");
            break;
          case "custom":
            createNewCard(getListId, "Custom Package");
            break;
          default:
            break;
        }
      }
    } else {
      createNewList(getBoardId);
    }
  }

  async function createNewList(getBoardId) {
    const createList = await axios.post(
      `https://api.trello.com/1/boards/${getBoardId[0]}/lists?name=${config.TRELLO_LIST_NAME}&key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`
    );

    console.log("List created");

    generateTrelloTask();
  }

  async function createNewCard(getListId, type) {
    const createCard = await axios.post(
      `https://api.trello.com/1/cards/?idList=${getListId[0]}&key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name: title + " - " + type,
        desc: "random task desc",
      }
    );

    const cardData = await createCard.data;

    const getCardId = cardData.id;

    console.log("Card created");

    createChecklist(getCardId, type);
  }

  async function createChecklist(getCardId, type) {
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
    // Get all tasks from database
    const { Task } = require("../models");

    const tasks = await Task.findAll({
      attributes: ["id", "title", "taskCategory", "taskTags", "taskShort"],
    });
    const allTaskData = await tasks.map((x) => {
      return x.dataValues;
    });

    //console.log(allTaskData);

    // Recursive function to create checklist item
    if (dUpdate === "true") {
      createChecklistItemRecursively(
        getChecklistId,
        allTaskData,
        "Drupal Update"
      );
    }
  }

  async function createChecklistItemRecursively(
    getChecklistId,
    allTaskData,
    tag
  ) {
    // Filter all tasks by tag
    const filteredTask = allTaskData.filter((x) => {
      return x.taskTags.includes(tag);
    });

    filteredTask.forEach((x) => {
      // Create checklist item
      generateChecklistItem(getChecklistId, x);
    });

    //createChecklistItem(getChecklistId);
  }

  async function generateChecklistItem(getChecklistId, data) {
    const createChecklistItem = await axios.post(
      `https://api.trello.com/1/checklists/${getChecklistId}/checkItems?key=${config.TRELLO_API_KEY}&token=${config.TRELLO_API_TOKEN}`,
      {
        name:
          data.taskShort + " --- " + config.FRONTEND_URL + "/task/" + data.id,
      }
    );

    const checklistItemData = await createChecklistItem.data;
    console.log("Checklist item created");
  }

  // Start the function
  generateTrelloTask();

  res.status(200).send({ message: "Your form successfully accepted!" });
};
