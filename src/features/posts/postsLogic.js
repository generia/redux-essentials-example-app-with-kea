import {kea} from "kea";
import {client} from "../../api/client"
import {immerify} from "../../runtime";

export default kea({
    defaults: {
        posts: {
            ids: [],
            entities: {},
            status: 'idle',
            error: undefined
        }
    },
    actions: () => ({
        fetchPosts: true,
        setPosts: posts => ({posts}),
        setStatus: status => ({status}),
        reactionAdded: (postId, reaction) => ({postId: postId, reaction: reaction}),
        addNewPost: (initialPost) => (initialPost),
        postUpdated: (updatedPost) => (updatedPost),
        postsCleared: true,
        addPost: post => ({post}),
        reloadAllPosts: true
    }),
    reducers: () => ({
        posts: {
            setPosts: immerify ((_posts, { posts }) => {
                _posts.ids = []
                _posts.entities = {}
                if (posts) {
                    posts.map(post => {
                        const id = post.id
                        _posts.ids.push(id)
                        _posts.entities[id] = post
                    })
                }
                console.log('setPosts: ', posts, _posts)
                return _posts
            }),
            setStatus: immerify((_posts, { status }) => {
                console.log('setStatus: ', status, _posts)
                _posts.status = status
            }),
            reactionAdded: immerify((_posts, {postId, reaction}) => {
                const existingPost = _posts.entities[postId]
                if (existingPost) {
                    existingPost.reactions[reaction]++
                }
            }),
            postsCleared: immerify((_posts) => {
                return {
                    ids:[],
                    entities: {},
                    status: 'succeeded',
                    error: undefined
                }
            }),
            addPost: immerify((_posts, {post}) => {
                const id = post.id
                if (id) {
                    _posts.ids.push(id)
                    _posts.entities[id] = post
                } else {
                    throw new Error("addPost: missing id in post")
                }
            }),
            postUpdated: immerify((_posts, updatedPost) => {
                console.log("posts.postUpdated", updatedPost)
                const id = updatedPost.id
                const post = _posts.entities[id]
                if (post) {
                    _posts.entities[id] = {...post, ...updatedPost}
                } else {
                    throw new Error("postUpdated: id does not exist")
                }
            })
        }
    }),
    selectors: ({ selectors }) => ({
        selectPostIds: [() => [selectors.posts], (posts) => {
            //console.log('selectors: selectPostIds', posts)
            return posts.ids
        }],
        selectAllPosts: [() => [selectors.posts], (posts) => {
            return Object.values(posts.entities)
        }]
    }),
    listeners: ({ actions }) => ({
        fetchPosts: async () => {
            actions.setStatus('loading')
            const response = await client.get('/fakeApi/posts')
            actions.setPosts(response.posts)
            actions.setStatus('succeeded')
        },
        reloadAllPosts: async () => {
            actions.postsCleared()
            actions.fetchPosts()
        },
        addNewPost: async (initialPost) => {
            const response = await client.post('/fakeApi/posts', { post: initialPost })
            actions.addPost(response.post)
        }
    }),
    accessors: ({values}) => ({
        selectPostById(id) {
            const entities = values.posts.entities;
            return entities[id]
        },
        selectPostsForUser(userId) {
            return values.selectAllPosts.filter(post => post.user === userId)
        }
    })
});
