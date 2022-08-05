const axios = require("axios");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

var exports = (module.exports = {});

exports.apiTaskManagerForm = async function (req, res) {
  const { title, packages } = req.body;
  console.log(req.body);

  async function getMeisterProjects() {
    const projectResponse = await axios.get(
      "https://www.meistertask.com/api/projects",
      {
        headers: {
          Authorization: `Bearer ${config.meisterapikey}`,
        },
      }
    );
    const projectData = await projectResponse.data;

    const getProject = projectData
      .filter((x) => x.name === config.meisterprojectname)
      .map((x) => {
        return x.id;
      });

    const sectionResponse = await axios.get(
      "https://www.meistertask.com/api/sections",
      {
        headers: {
          Authorization: `Bearer ${config.meisterapikey}`,
        },
      }
    );
    const sectionData = await sectionResponse.data;

    const getSection = sectionData
      .filter((x) => x.project_id === getProject[0] && x.name === "Open")
      .map((x) => {
        return x.id;
      });

    const postTaskResponse = await axios.post(
      `https://www.meistertask.com/api/sections/${getSection[0]}/tasks`,
      {
        name: title,
      },
      {
        headers: {
          Authorization: `Bearer ${config.meisterapikey}`,
        },
      }
    );
    const postTaskData = await postTaskResponse.data;

    console.log(postTaskData);

    //const postChecklistResponse = await axios.post(
    //  `https://www.meistertask.com/api/checklists/${postTaskData.id}/checklist_items`,
    //  {
    //    name: "Test Checklist",
    //  },
    //  {
    //    headers: {
    //      Authorization: `Bearer ${config.meisterapikey}`,
    //    },
    //  }
    //);
    //const postChecklistData = await postChecklistResponse.data;

    //console.log(postChecklistData);
  }

  getMeisterProjects();

  res.status(200).send({ message: "Your form successfully accepted!" });
};
