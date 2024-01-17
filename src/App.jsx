import './App.css';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore"; 
import { db } from './firebase-config';
import { useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState("");
  const [userId, setUserId] = useState(""); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    getData();
    checkUser();
  }, []);

  const checkUser = async () => {
    const auth = getAuth();
    const user = await getAuth().currentUser;
    if (user) {
      setUserId(user.displayName);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      console.log("Document deleted with ID: ", postId);
      getData();
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const postData = async (author, text, name) => {
    const storage = getStorage();

    try {
      let imageUrl = "";
      let videoUrl = "";

      if (selectedImage) {
        const uniqueImageId = uuidv4();
        const imageExtension = selectedImage.name.split('.').pop();
        const imageFileName = `${uniqueImageId}.${imageExtension}`;
        const imageStorageRef = ref(storage, `images/${imageFileName}`);

        const imageSnapshot = await uploadBytes(imageStorageRef, selectedImage);
        imageUrl = await getDownloadURL(imageSnapshot.ref);
      }

      if (selectedVideo) {
        const uniqueVideoId = uuidv4();
        const videoExtension = selectedVideo.name.split('.').pop();
        const videoFileName = `${uniqueVideoId}.${videoExtension}`;
        const videoStorageRef = ref(storage, `videos/${videoFileName}`);

        const videoSnapshot = await uploadBytes(videoStorageRef, selectedVideo);
        videoUrl = await getDownloadURL(videoSnapshot.ref);
      }

      const docRef = await addDoc(collection(db, "posts"), {
        Author: author,
        Text: text,
        ImageUrl: imageUrl,
        VideoUrl: videoUrl,
      });

      console.log("Document written with ID: ", docRef.id);
      setNewText("");
      setSelectedImage(null);
      setSelectedVideo(null);
      getData();
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const signOutFunc = async () => {
    setUserId("");
    const auth = getAuth();
    await signOut(auth);
    console.log("signed out");
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postsArray = [];
    querySnapshot.forEach((doc) => {
      let post = doc.data();
      post.id = doc.id;
      postsArray.push(post);
    });
    console.log(postsArray);
    setPosts(postsArray);
  };

  return (
    <main>
      <h1>THERAPY</h1>

      <button onClick={() => signOutFunc()}>Sign out</button>
      <br />
      <span className="text-container">
        <span>Author</span>
        <span>{userId}</span>
      </span>
      <br />
      <span>Text</span>
      <input
        type="text"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      />
      Image
      <input
        type="file"
        name="myImage"
        accept="image/*"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      Video
      <input
        type="file"
        name="myVideo"
        accept="video/*"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedVideo(event.target.files[0]);
        }}
      />
      <button onClick={() => postData(userId, newText)}>POST</button>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h1>{post.Author}</h1>
            <p>{post.Text}</p>
            <button onClick={() => deletePost(post.id)}>Delete</button>
            {post.ImageUrl ? (
              <img src={post.ImageUrl} alt={`Posted by ${post.Author}`} />
            ) : (
              <p>No image available</p>
            )}
            {post.VideoUrl && (
              <video width="320" height="240" controls>
                <source src={post.VideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
