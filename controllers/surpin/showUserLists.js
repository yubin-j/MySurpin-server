const getSrupinLists = require("../../utils/getSurpins");
const { User, Surpin, Surpin_Tags, Tags, sequelize } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { nickname } = req.query;
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;
    const tagOption = {};

    if (!nickname) {
      res.status(400).json({ message: "Unsufficient info" });
    }

    //요청한 사용자가 있는지 확인
    const { count, rows } = await User.findAndCountAll({
      where: { nickname },
    });

    if (count !== 1) {
      //없거나 2명 이상이 조회되는 경우
      res.status(404).json({ message: "Non exists user" });
    } else {
      //사용자가 가지고 있는 모든 태그를 담는 구문
      const userTags = await Surpin_Tags.findAll({
        attributes: [
          [sequelize.col("Tag.name"), "tagName"],
          [sequelize.fn("COUNT", "listId"), "count"],
        ],
        include: [
          {
            model: Surpin,
            attributes: [],
            required: true,
            where: { userId: rows[0].id },
          },
          { model: Tags, attributes: [], required: true },
        ],
        group: "tagsId",
      });

      if (tag) {
        tagOption.name = tag;
      }
      res.json({
        ...(await getSrupinLists(
          offset,
          10,
          { userId: rows[0].id },
          tagOption
        )),
        isValid: nickname === (req.isValid ? req.isValid.nickname : false),
        userTags,
      });
    }
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showUserLists.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in showUserLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
