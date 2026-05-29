export const users = [
  {
    id: 1,
    image: "/src/images/speedlol.jpg",
    name: "Albert",
    username: "@albert",
    postCount: 7,
    followers: 123,
    following: 72,
  },

  {
    id: 2,
    name: "Joe",
    username: "@Joe12",
    postCount: 2,
    followers: 21,
    following: 102,
  },

  {
    id: 3,
    name: "Sally",
    username: "@SallyWag",
    postCount: 3,
    followers: 4567,
    following: 41,
  },

  {
    id: 4,
    name: "Susie",
    username: "@Gamer",
    postCount: 1,
    followers: 82,
    following: 0,
  },
];

export const posts = [
  {
    id: 1,
    userId: 1,
    name: "Albert",
    username: "@albert",
    game: "Minecraft",
    content: "#Speedrun",
    tag: "#Nostalgia",
    likes: 157,
    commentCount: 22,
    shareCount: 34,
    image: "/src/images/MinecraftGameplay.png",
    comments: [
      {
        id: 1,
        userId: 2,
        textContent: "Wow this is amazing",
        likes: 9
      }, {
        id: 2,
        userId: 3,
        textContent: "I hate this",
        likes: 0,
      }
    ]
  },

  {
    id: 2,
    userId: 2,
    name: "Joe",
    username: "@Joe12",
    game: "Clash of Clans",
    content: "#Gameplay",
    tag: "#Funny",
    likes: 27,
    commentCount: 6,
    shareCount: 21,
    image: "/src/images/ClashOfClansGameplay.png",
    comments: [
      {
        id: 1,
        userId: 2,
        textContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
        likes: 202,
      }
    ]
  },

  {
    id: 3,
    userId: 3,
    name: "Sally",
    username: "@SallyWag",
    game: "Call of Duty",
    content: "#Gameplay",
    tag: "#Commentary",
    likes: 47,
    commentCount: 61,
    shareCount: 54,
    image: "/src/images/CODGameplay.png",
    comments: [
      {
        id: 1,
        userId: 1,
        textContent: "Lorem ipsum",
        likes: 21,
      }
    ]
  },

  {
    id: 4,
    userId: 4,
    name: "Susie",
    username: "@Gamer",
    game: "Fortnite",
    content: "#Trolling",
    tag: "#Funny",
    likes: 1002,
    commentCount: 123,
    shareCount: 200,
    image: "/src/images/fortnite.png",
    comments: [
      {
        id: 1,
        userId: 1,
        textContent: "First",
        likes: 9,
      }, {
        id: 2,
        userId: 2,
        textContent: "Second",
        likes: 0,
      }, {
        id: 3,
        userId: 4,
        textContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
        likes: 0,
      }, {
        id: 4,
        userId: 4,
        textContent: "Wow",
        likes: 0,
      }
    ]
  },
];

export const messages = [
  {
    messageNum: 1,
    Sender: "@albert",
    Recipient: "@SallyWag",
    Message: "We hopping on tonight?",
  },

  {
    messageNum: 2,
    Sender: "@SallyWag",
    Recipient: "@albert",
    Message: "Yeah lets run it",
  },

  {
    messageNum: 3,
    Sender: "@albert",
    Recipient: "@SallyWag",
    Message: "Ok ill be online in 10 minutes",
  },

  {
    messageNum: 1,
    Sender: "@albert",
    Recipient: "@Gamer",
    Message: "Your recent post was crazy",
  },

  {
    messageNum: 2,
    Sender: "@Gamer",
    Recipient: "@albert",
    Message: "Thanks Joe!",
  },

  {
    messageNum: 1,
    Sender: "@Joe12",
    Recipient: "@albert",
    Message: "Yo",
  },
]
