import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriends() {
    setShowAddFriends((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((prevFriends) => [...prevFriends, friend]);
    setShowAddFriends(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriends(false);
  }

  function handleSplitBill(value) {
    setFriends(
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriends && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriends}>
          {showAddFriends ? "Close" : "Add"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)} Rs
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)} Rs
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🎀Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>😌Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <Button>Add Friend</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>
      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>
      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
