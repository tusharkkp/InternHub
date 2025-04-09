import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, addComment } from '../store/slices/forumSlice';

const initialPosts = [
  {
    id: '1',
    title: 'Looking for React Developer',
    content: 'We\'re looking for a React developer to join our team for a new project. Experience with Redux and TypeScript is a plus.',
    author: { id: '1', name: 'John Doe' },
    comments: [],
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '2',
    title: 'Best resources for learning Node.js',
    content: 'I\'m looking for recommendations on the best resources to learn Node.js for beginners. Any suggestions?',
    author: { id: '2', name: 'Jane Smith' },
    comments: [
      {
        id: '1',
        content: 'I would recommend checking out the official Node.js documentation and following their tutorials.',
        author: { id: '3', name: 'Bob Johnson' },
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const Forum = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.forum);
  
  const [forumPosts, setForumPosts] = useState(posts.length > 0 ? posts : initialPosts);
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [commentDialog, setCommentDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleNewPost = () => {
    setNewPost({ title: '', content: '' });
    setNewPostDialog(true);
  };

  const handleCloseNewPost = () => {
    setNewPostDialog(false);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    const post = {
      id: (forumPosts.length + 1).toString(),
      ...newPost,
      author: { id: user?.id || '1', name: user?.name || 'Anonymous' },
      comments: [],
      createdAt: new Date().toISOString()
    };

    dispatch(addPost(post));
    setForumPosts([...forumPosts, post]);
    setNewPostDialog(false);
    setSnackbar({
      open: true,
      message: 'Post created successfully!',
      severity: 'success'
    });
  };

  const handleReply = (post) => {
    setCurrentPost(post);
    setNewComment('');
    setCommentDialog(true);
  };

  const handleCloseComment = () => {
    setCommentDialog(false);
  };

  const handleAddComment = () => {
    if (!newComment) {
      setSnackbar({
        open: true,
        message: 'Comment cannot be empty',
        severity: 'error'
      });
      return;
    }

    const comment = {
      id: (currentPost.comments.length + 1).toString(),
      content: newComment,
      author: { id: user?.id || '1', name: user?.name || 'Anonymous' },
      createdAt: new Date().toISOString()
    };

    dispatch(addComment({ postId: currentPost.id, comment }));
    
    // Update local state
    const updatedPosts = forumPosts.map(post => 
      post.id === currentPost.id 
        ? { ...post, comments: [...post.comments, comment] } 
        : post
    );

    setForumPosts(updatedPosts);
    setCommentDialog(false);
    setSnackbar({
      open: true,
      message: 'Comment added successfully!',
      severity: 'success'
    });
  };

  const handleSharePost = (post) => {
    navigator.clipboard.writeText(`Check out this discussion: ${post.title}`);
    setSnackbar({
      open: true,
      message: 'Post link copied to clipboard!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 4 }}>
        <Typography variant="h4" component="h1">
          Discussion Forum
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNewPost}
        >
          New Post
        </Button>
      </Box>
      
      {forumPosts.map(post => (
        <Card sx={{ mb: 3 }} key={post.id}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {post.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Posted by {post.author.name} • {formatDate(post.createdAt)}
            </Typography>
            <Typography variant="body1" paragraph>
              {post.content}
            </Typography>
            
            {post.comments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Comments ({post.comments.length})
                </Typography>
                
                {post.comments.map(comment => (
                  <Box key={comment.id} sx={{ display: 'flex', mt: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      {comment.author.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {comment.author.name}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              color="primary"
              onClick={() => handleReply(post)}
            >
              Reply
            </Button>
            <Button 
              size="small" 
              color="primary"
              onClick={() => handleSharePost(post)}
            >
              Share
            </Button>
          </CardActions>
        </Card>
      ))}

      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onClose={handleCloseNewPost} fullWidth maxWidth="md">
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewPost} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreatePost} color="primary" variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={commentDialog} onClose={handleCloseComment} fullWidth maxWidth="md">
        <DialogTitle>Reply to {currentPost?.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="content"
            label="Your Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComment} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddComment} color="primary" variant="contained">
            Reply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Forum; 