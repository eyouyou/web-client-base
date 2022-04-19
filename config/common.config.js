module.exports = {
    title: "TITLE",
    icon: "favicon.ico",
    routes: [
        {
            name: 'main',
            path: 'main',
            component: 'views/main/index',
            authority: -1,
            routes: [{
                name: 'world',
                path: 'world',
                title: "世界",
                component: 'views/world/index',
                routes: [{
                    name: '1',
                    path: 'world1',
                    title: "世界1",
                    component: 'views/world/world1',
                    routes: [{
                        name: '1-1',
                        path: 'world11',
                        title: "世界1-1",
                        component: 'views/world/world11',
                    }]
                }, {
                    name: '2',
                    path: 'world2',
                    title: "世界2",
                    component: 'views/world/world2',
                }]
            },
            {
                name: 'nice',
                path: 'nice',
                title: "哈哈哈哈哈",
                component: 'views/nice/index'
            }]
        },
        {
            name: 'login',
            path: 'login',
            component: 'views/login/index'
        },
        {
            name: 'login_settings',
            path: 'settings',
            component: 'views/login_settings/index'
        },
        {
            name: 'not_found',
            path: '*',
            component: 'views/not_found/index'
        }]

};
