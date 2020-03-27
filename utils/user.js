const users = [];

const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};

const getCurrentUser = id => {
    return users.find(user => user.id === id);
};

const userLeaves = id => {
    const index = users.findIndex(user => id !== user.id);
    if (index !== -1) {
        // console.log(users.splice(index, 1)[0]);
        return users.splice(index, 1)[0];
    }
};

const getUserRoom = room => {
    return users.filter(user => user.room === room);
};

module.exports = { userJoin, getCurrentUser, userLeaves, getUserRoom };
