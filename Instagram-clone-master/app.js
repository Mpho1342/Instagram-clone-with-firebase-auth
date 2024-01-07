const searchInput = document.querySelector(".search-input"); 
const searchBtn = document.querySelector("#search-btn");
const postsDiv = document.querySelector(".posts");
const usernameInput = document.querySelector("#username");
const imageLinkInput = document.querySelector("#imagelink");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post-btn");
const editPostBtn = document.querySelector("#edit-post-btn");
const logoutBtn = document.querySelector("#logout-btn");
editPostBtn.style.display = "none";

const editBtn = document.querySelector("#edit-btn");

const modal = new bootstrap.Modal(document.getElementById("modal"));
const showCreateModal = document.querySelector("#show-create-modal");


searchBtn.addEventListener("click", () => {
  searchInput.style.background = "red";
});
createPostBtn.addEventListener("click", () => {
  createPost(imageLinkInput.value, captionInput.value, usernameInput.value);
});
showCreateModal.addEventListener("click", () => {
  isEditMode = false;
  createPostBtn.style.display = "block";
  editPostBtn.style.display = "none";
  usernameInput.value = "";
  imageLinkInput.value = "";
  captionInput.value = "";
  modal.show();
});
editPostBtn.addEventListener("click", () => {
  updatePost(postToEditId, imageLinkInput.value, captionInput.value);
  modal.hide();
});
logoutBtn.addEventListener("click", () => {
  handleLogout();
});

var feed = [];
var isEditMode = false;
var postToEditId = null;

const uploadPostToFirebase = (post) => {
  db.collection("posts")
    .doc(post.id + "")
    .set(post)
    .then(() => {
    })
    .catch((error) => {
    });
};

const getPostsFromFirebase = () => {
  db.collection("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        feed.push(doc.data());
        outputFeed();
      });
    });
};

const createPost = (imageLink, caption, username) => {
  const newPost = {
    id: feed.length,
    username: username,
    imageLink: imageLink,
    caption: caption,
    likes: 0,
    comments: [],
    shares: 0,
    isPublic: true,
    createdAt: new Date(),
  };
  uploadPostToFirebase(newPost);
  feed.push(newPost);
  outputFeed();
  modal.hide();
};

const outputFeed = () => {
  const updatedFeed = feed.map((post) => {
    return `<div class="col-12 posts justify-content-center">
    <div class="card post" style="width: 90%;">
    <img src="${post.imageLink}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${post.username}</h5>
      <p class="card-text">${post.caption}</p>
      <img style="width: 20px; margin: 10px"
                    src="./assets/edit.png"
                    onclick="showEditPostModal(${post.id})"
                    alt="">
    </div>
  </div>
</div>
</div>
`;
  });
  postsDiv.innerHTML = updatedFeed.join(" ");
};

const updatePost = (id, newImageLink, newCaption) => {

  const updatedFeed = feed.map((post) => {
    if (post.id === id) {
      post.imageLink = newImageLink;
      post.caption = newCaption;
    }
    return post;
  });
  feed = updatedFeed;
  uploadPostToFirebase(feed[id]);
  outputFeed();
};

const deletePost = (id) => {
  const updatedFeed = feed.filter((post) => {
    if (post.id !== id) {
      return post;
    }
  });
  feed = updatedFeed;
};

const outputPostStatus = (post) => {
  const output = `
  POST INFO:
  ID: ${post.id}
  Username: ${post.username}
  Image Link: ${post.imageLink}
  Caption: ${post.caption}
  `;
  return output;
};

const showEditPostModal = (id) => {
  postToEditId = id;
  isEditMode = true;
  createPostBtn.style.display = "none";
  editPostBtn.style.display = "block";
  const postToEdit = feed[id];
  usernameInput.value = postToEdit.username;
  imageLinkInput.value = postToEdit.imageLink;
  captionInput.value = postToEdit.caption;
  modal.show();
};

outputFeed();
getPostsFromFirebase();

