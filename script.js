const button = document.querySelector('#search')
//https://api.github.com/users/
async function get () {
    //nickname
    const nickname = document.getElementById('txtname').value
    let validate = 0;
    if (nickname != ""){
        try {
            const responseUser = await fetch(`https://api.github.com/users/${nickname}`);
            console.log(responseUser)
            const dataUser = await responseUser.json();
            console.log(dataUser)
    
            const responseRepos = await fetch(`${dataUser.repos_url}`);
            const dataRepos = await responseRepos.json();
            
            //name
            let name = "Usuário sem nome"
            if (dataUser.name ){   
                if (dataUser.name.split(' ').length > 1) {
                    const [firstName, secondName] = dataUser.name.split(' ');
                    name = [firstName, secondName].join(" ")
                } else {
                    name = dataUser.name
                }
            } 

            //img
            const avatar = dataUser.avatar_url;
            //followers
            const folow = dataUser.followers;
            //repos
            const countRepos = dataUser.public_repos;
    
            const [repo0, repo01, repo02] = dataRepos.sort((a, b) => new Date(b.created_at) -new Date(a.created_at));
            console.log(repo01.clone_url)
            validate = true
            return {nickname, name, avatar, folow, countRepos, repo0, repo01, repo02, validate} 
        } catch (error) {
            Toast.show('Usuário não encontrado', 'error')
            validate = false
            return validate
        }
        
    } else {
        Toast.show('Por favor insira o usuário', 'error')
        validate = false
        return validate
    }
    
}

const res = document.querySelector('#res')
const github = document.querySelector('.github')
const card = {
    async show(){
        res.innerHTML = ""
        res.classList.remove('visible')
        github.classList.remove('visible')
        const data  = await get()
        if(data.validate){
            github.classList.add('visible');
            res.classList.add('card');
            res.classList.add('visible');

            const profile = document.createElement('div')
            profile.classList.add("profile") 
            const profileImg = document.createElement('img')
            profileImg.setAttribute('src', data.avatar)

            profile.appendChild(profileImg)
            res.appendChild(profile)


            const infos = document.createElement('div')
            infos.classList.add("infos") 

            const infosName = document.createElement('h2')
            infosName.innerHTML = `${data.name}`

            const infosNickname = document.createElement('h3')
            infosNickname.innerHTML = `Username: ${data.nickname}`

            const infos2 = document.createElement('div')
            infos2.classList.add("infos2") 

            const infosFolow = document.createElement('p')
            infosFolow.innerHTML = `Followers: ${data.folow}` 
            
            const infosRepos = document.createElement('p')
            infosRepos.innerHTML = `Repositories: ${data.countRepos}` 

            infos.appendChild(infosName)
            infos.appendChild(infosNickname)    
            infos2.appendChild(infosFolow)
            infos2.appendChild(infosRepos)
            infos.appendChild(infos2)
            res.appendChild(infos)
            

            const repos = document.createElement('div')
            repos.classList.add("repos") 

            const repositories = document.createElement('h2')
            repositories.innerHTML = `Newest Repositories: `

            const repo0 = document.createElement('a')
            repo0.setAttribute('href', data.repo0.clone_url)
            repo0.setAttribute('target', "_blank")
            repo0.innerHTML = `${data.repo0.name}<br>`

            const repo01 = document.createElement('a')
            repo01.setAttribute('href', data.repo01.clone_url)
            repo01.setAttribute('target', "_blank")
            repo01.innerHTML = `${data.repo01.name}<br>`
        
            const repo02 = document.createElement('a')
            repo02.setAttribute('href', data.repo02.clone_url)
            repo02.setAttribute('target', "_blank")
            repo02.innerHTML = data.repo02.name

            repos.appendChild(repositories)
            repos.appendChild(repo0)    
            repos.appendChild(repo01)
            repos.appendChild(repo02)
            res.appendChild(repos)
        }
    }
}

button.addEventListener('click', e => {
    card.show();
});

