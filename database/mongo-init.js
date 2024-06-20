// db.createUser({
// 	user: _getEnv("DB_USERNAME"),
// 	pwd: _getEnv("DB_PASSWORD"),
// 	roles: [
// 		{
// 			role: "readWrite",
// 			db: _getEnv("MONGO_INITDB_DATABASE"),
// 		},
// 	],
// });

db = db.getSiblingDB("admin");
db.auth(
  _getEnv("MONGO_INITDB_ROOT_USERNAME"),
  _getEnv("MONGO_INITDB_ROOT_PASSWORD")
);
db = db.getSiblingDB(_getEnv("MONGO_INITDB_DATABASE"));

db.createUser({
  user: _getEnv("DB_USERNAME"),
  pwd: _getEnv("DB_PASSWORD"),
  roles: [
    {
      role: "readWrite",
      db: _getEnv("MONGO_INITDB_DATABASE"),
    },
  ],
});
