import * as React from 'react';

const GithubMenuItem = (data: any) => (
    <div key={data.id}>
        <img
            alt={data.user.login}
            src={data.user.avatar_url}
            style={{
                height: '24px',
                marginRight: '10px',
                width: '24px',
            }}
        />
        <span>{data.user.login}</span>
    </div>
);


export default GithubMenuItem;