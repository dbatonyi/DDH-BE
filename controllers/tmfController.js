const axios = require("axios");

const appConfig = require("../app-config.json")["variables"];

var exports = (module.exports = {});

exports.apiTaskManagerForm = async function (req, res) {
  const {
    title,
    devUrl,
    devSsh,
    dUpdate,
    ourServer,
    oldUrl,
    dVersion,
    migration,
    packages,
    blog,
    webshop,
    moreLanguage,
    otherLanguage,
    paymentMethod,
    paymentMethodOther,
    currency,
    currencyOther,
    customWebshop,
    customerRegistration,
    uniqueProductVariation,
    upvAdditional,
    invoiceSystem,
    stockManagement,
    stockUpdate,
    additionalCurrencies,
    additionalCurrenciesOther,
    additionalVat,
    additionalVatOther,
    couponSystem,
    productFilters,
    additionalFilters,
    productPages,
    webshopFeatures,
    extraElements,
    extraElementsOther,
    flexibleLayout,
    uniqueDesign,
    uniqueDesignUrl,
    uniqueEmail,
    extraFeatures,
  } = req.body.values;

  console.log(req.body.values);

  async function generateTrelloTask() {
    const getAllBoard = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`
    );
    const boardsData = await getAllBoard.data;

    const checkBoardExist = boardsData.find(
      (board) => board.name === appConfig.trelloBoardName
    );

    if (checkBoardExist) {
      checkBoardList(boardsData);
    } else {
      createNewBoard();
    }
  }

  async function createNewBoard() {
    const createBoard = await axios.post(
      `https://api.trello.com/1/boards?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`,
      {
        name: appConfig.trelloBoardName,
        desc: "This is a board for DDH Project",
      }
    );

    console.log("Board created");

    generateTrelloTask();
  }

  async function checkBoardList(boardsData) {
    const getBoardId = boardsData
      .filter((x) => x.name === appConfig.trelloBoardName)
      .map((x) => {
        return x.id;
      });

    const getBoardList = await axios.get(
      `https://api.trello.com/1/boards/${getBoardId[0]}/lists?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`
    );
    const boardListData = await getBoardList.data;

    const checkListExist = boardListData.find(
      (board) => board.name === appConfig.trelloListName
    );

    if (checkListExist) {
      const getListId = boardListData
        .filter((x) => x.name === appConfig.trelloListName)
        .map((x) => {
          return x.id;
        });

      if (dUpdate?.value === "true") {
        await createNewCard(getListId, "Drupal update");
      }

      if (packages?.value !== "") {
        await createNewCard(getListId, "Install/Config Drupal");

        switch (packages?.value) {
          case "basic":
            await createNewCard(getListId, "Basic Package");
            break;
          case "flexi":
            await createNewCard(getListId, "Flexi Package");
            break;
          case "custom":
            await createNewCard(getListId, "Custom Package");
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
      `https://api.trello.com/1/boards/${getBoardId[0]}/lists?name=${appConfig.trelloListName}&key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`
    );

    console.log("List created");

    generateTrelloTask();
  }

  async function createNewCard(getListId, type) {
    const cardDescription = `${devUrl} \n ${devSsh} \n ${
      oldUrl ? "Old site: " + oldUrl : ""
    }`;
    const createCard = await axios.post(
      `https://api.trello.com/1/cards/?idList=${getListId[0]}&key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`,
      {
        name: `${title} - ${type}`,
        desc: cardDescription,
      }
    );

    const cardData = await createCard.data;

    const getCardId = cardData.id;

    console.log("Card created");

    createChecklist(getCardId, type);
  }

  async function createChecklist(getCardId, type) {
    const createChecklist = await axios.post(
      `https://api.trello.com/1/cards/${getCardId}/checklists?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`,
      {
        name: "Checklist",
      }
    );

    const checklistData = await createChecklist.data;

    const getChecklistId = checklistData.id;

    console.log("Checklist created");

    checklistItemController(getChecklistId, type);
  }

  async function checklistItemController(getChecklistId, type) {
    // Get all tasks from database
    const { Task } = require("../models");

    const tasks = await Task.findAll({
      attributes: ["id", "title", "taskCategory", "taskTags", "taskShort"],
    });
    const allTaskData = await tasks.map((x) => {
      return x.dataValues;
    });

    switch (type) {
      case "Drupal update":
        await createChecklistItem(getChecklistId, allTaskData, "Drupal update");

        if (ourServer?.value === "false") {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "External server"
          );
        }
        if (dVersion?.value) {
          if (dVersion?.value === "d7-latest") {
            await createChecklistItem(getChecklistId, allTaskData, "Drupal 7");
          } else if (dVersion?.value === "d8-latest") {
            await createChecklistItem(getChecklistId, allTaskData, "Drupal 8");
          }
        }
        if (migration === true) {
          await createChecklistItem(getChecklistId, allTaskData, "Migration");
        }
        break;
      case "Install/Config Drupal":
        await createChecklistItem(
          getChecklistId,
          allTaskData,
          "Install Drupal"
        );
        break;
      case "Basic Package":
        await packageController(getChecklistId, allTaskData);

        break;
      case "Flexi Package":
        await packageController(getChecklistId, allTaskData);

        break;
      case "Custom Package":
        await packageController(getChecklistId, allTaskData);

        break;
      default:
        break;
    }
  }

  async function packageController(getChecklistId, allTaskData) {
    if (moreLanguage === true && otherLanguage) {
      await postUniqueChecklistItem(
        getChecklistId,
        "More language",
        otherLanguage
      );
    }

    if (blog === true) {
      await createChecklistItem(getChecklistId, allTaskData, "Blog");
    }

    if (webshop === true) {
      await createChecklistItem(getChecklistId, allTaskData, "Webshop");

      if (paymentMethod?.value) {
        await createChecklistItem(
          getChecklistId,
          allTaskData,
          "Payment method"
        );

        if (paymentMethod?.value === "other") {
          await postUniqueChecklistItem(
            getChecklistId,
            "Other payment method(s)",
            paymentMethodOther
          );
        }
      }

      if (currency?.value) {
        await createChecklistItem(getChecklistId, allTaskData, "Currency");

        if (currency?.value === "other") {
          await postUniqueChecklistItem(
            getChecklistId,
            "Other currency(s)",
            currencyOther
          );
        }
      }

      if (customWebshop === true) {
        await createChecklistItem(
          getChecklistId,
          allTaskData,
          "Custom webshop"
        );

        if (customerRegistration === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Customer registration"
          );
        }

        if (uniqueProductVariation === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Product variation"
          );

          if (upvAdditional) {
            await postUniqueChecklistItem(
              getChecklistId,
              "Additional product variation(s)",
              upvAdditional
            );
          }
        }

        if (invoiceSystem === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Invoice system"
          );
        }

        if (stockManagement === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Stock management"
          );
        }

        if (stockUpdate === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Stock update"
          );
        }

        if (additionalCurrencies === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Additional currencies"
          );

          if (additionalCurrenciesOther) {
            await postUniqueChecklistItem(
              getChecklistId,
              "Additional currency(s)",
              additionalCurrenciesOther
            );
          }
        }

        if (additionalVat === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Additional VAT"
          );

          if (additionalVatOther) {
            await postUniqueChecklistItem(
              getChecklistId,
              "Additional VAT(s)",
              additionalVatOther
            );
          }
        }

        if (couponSystem === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Coupon system"
          );
        }

        if (productFilters === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Product filters"
          );

          if (additionalFilters) {
            await postUniqueChecklistItem(
              getChecklistId,
              "Additional filter(s)",
              additionalFilters
            );
          }
        }

        if (productPages === true) {
          await createChecklistItem(
            getChecklistId,
            allTaskData,
            "Product pages"
          );
        }

        if (webshopFeatures) {
          await postUniqueChecklistItem(
            getChecklistId,
            "Additional webshop feature(s)",
            webshopFeatures
          );
        }
      }
    }

    if (extraElements === true) {
      await createChecklistItem(getChecklistId, allTaskData, "Layout elements");

      if (extraElementsOther) {
        await postUniqueChecklistItem(
          getChecklistId,
          "Additional layout element(s)",
          extraElementsOther
        );
      }
    }

    if (flexibleLayout === true) {
      await createChecklistItem(getChecklistId, allTaskData, "Flexible layout");
    }

    if (uniqueDesign === true) {
      await createChecklistItem(getChecklistId, allTaskData, "Unique design");

      if (uniqueDesignUrl !== null) {
        await postUniqueChecklistItem(
          getChecklistId,
          "Unique URL",
          uniqueDesignUrl
        );
      }

      if (uniqueEmail === true) {
        await createChecklistItem(
          getChecklistId,
          allTaskData,
          "Email template"
        );
      }
    }

    if (extraFeatures) {
      console.log(extraFeatures);
      await postUniqueChecklistItem(
        getChecklistId,
        "Additional site feature(s)",
        extraFeatures
      );
    }
  }

  async function createChecklistItem(getChecklistId, allTaskData, tag) {
    // Filter all tasks by tag
    const filteredTask = allTaskData.filter((x) => {
      return x.taskTags.includes(tag);
    });

    console.log(tag);

    for (const x of filteredTask) {
      // Create checklist item
      await postChecklistItem(getChecklistId, x);
    }
  }

  async function postChecklistItem(getChecklistId, data) {
    const checklistItem = await axios.post(
      `https://api.trello.com/1/checklists/${getChecklistId}/checkItems?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`,
      {
        name: `${data.taskShort} -- ${data.taskCategory} --- ${appConfig.frontendUrl}/task/${data.id}`,
      }
    );

    console.log("Checklist item created");
  }

  async function postUniqueChecklistItem(getChecklistId, title, text) {
    const checklistItem = await axios.post(
      `https://api.trello.com/1/checklists/${getChecklistId}/checkItems?key=${appConfig.trelloApiKey}&token=${appConfig.trelloApiToken}`,
      {
        name: `${title} - ${text}`,
      }
    );

    console.log("Unique checklist item created");
  }

  // Check API Token
  const authenticateToken = req.headers['authenticate'];

  if(!authenticateToken || appConfig.apiToken !== authenticateToken.slice(7)) {
    return res.send({ message: "API token not valid!" });
  }

  // Start the function
  generateTrelloTask();

  res.status(200).send({ message: "Your form successfully accepted!" });
};
