import Sequelize from "sequelize";
import PostModel from "./Post.js";
import UserModel from "./User.js";


let db;
if (process.env.RDS_HOSTNAME) {
	console.log("Connecting to RDS", process.env.RDS_HOSTNAME);
	// if we're running on elasticbeanstalk, use elasticbeanstalk connection
	db = new Sequelize(`postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`, {
		logging: false,
	})
} else {
	console.log("Connecting to local database");
	// if we're running locally, use the localhost connection
	db = new Sequelize("postgres://hackupstate@localhost:5432/blog", {
		logging: false,
	});
}


const Post = PostModel(db);
const User = UserModel(db);

const connectToDB = async () => {
  try {
    await db.authenticate();
    console.log("Connected to DB successfully");

   await db.sync({ force: false });
  } catch (error) {
    console.error(error);
    console.error("PANIC! DB POBLEM!");
  }

  Post.belongsTo(User, { foreignKey: "userID" });
};

connectToDB();

export { db, Post, User };
