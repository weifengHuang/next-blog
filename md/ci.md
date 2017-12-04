# 持续集成方案

标签（空格分隔）： 未分类

---
#目录
###1. 持续集成 CI 介绍 + gitlab-runner 搭建
###2. gitlab-ci.yml 介绍
###3. docker 测试环境搭建
###4. 前后端测试（接口测试 + puppeter 前端自动化测试）
###5. 前后端自动部署


# 1、持续集成 CI 介绍+ gitlab-runne 搭建
## 1-1 持续集成 CI 介绍
**定义**:  
自动测试+自动部署
**为什么需要持续集成**:
 1. 增加代码可靠性: 每次提交代码到仓库，都会完整跑一遍测试，测试通过才合并
 2. 自动化部署，减少人工处理复杂度
**如何使CI工作**
在gitlab上面部署持续集成，需要以下，
1. 需要在仓库根目录创建一个名为 .gitlab-ci.yml 的文件
2. 为该项目配置一个 gitlab-runner

![](http://ozi0avz2v.bkt.clouddn.com/17-11-16/1672556.jpg)

## 1-2 gitlab-runner 搭建
### 1-2-1 gitlab-runner 安装
gitlab-runner是用go语言编写的一个开源程序，主要是用来读取.gitlab-ci.yml的文件，并根据对应的指令来执行脚本文件，执行结束以后会把对应的结果返回到gitlab上。
安装指令：
```
# For Debian/Ubuntu/Mint
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
# For RHEL/CentOS/Fedora
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
# For Debian/Ubuntu/Mint
sudo apt-get install gitlab-runner
# For RHEL/CentOS/Fedora
sudo yum install gitlab-runner
```
**安装文档： https://docs.gitlab.com/runner/install/linux-repository.html**
### 1-2-2 runner 注册
![](http://ozi0avz2v.bkt.clouddn.com/17-11-30/34970680.jpg)
**参考官方文档: http://docs.gitlab.com/runner/register/**
#### **1. 注册流程**
```
sudo gitlab-runner register
```
填写对应的 url 以及 token 及对应的 exectour,及一些其他配置描述，详细看官方文档
```
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://gitlab.com
Please enter the gitlab-ci token for this runner
xxx
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
docker

使用本地镜像，要在config.toml 增加pull_policy
vim /etc/gitlab-runner/config.toml
[[runners]]
  name = ""
  url = ""
  token = ""
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "nb-node"
    privileged = false
    disable_cache = false
    volumes = ["/cache"]
+   pull_policy = "if-not-present"
    [runners.cache]
```
#### **2、executor 分类，以及为何选用 docker 环境**
官方的执行器有以下几种:

 - Shell （简单易用）
 - Docker （能拉取各种镜像，每次编译环境干净）
 - ssh （连接到远程服务器，无法保证每次编译环境都是干净）
 - VirtualBox ( windows 下安装）
 - Docker Machine(auto-scaling) （docker 集群）
 - Kubernetes (Kubernetes 是 google 开源的容器集群管理系统)

**选用 docker 理由如下**
1. 直接拉取 node 镜像，也可以本地构建好所需要的镜像，直接使用本地镜像，速度快。
2. 每次的编译环境都是干净，避免污染, 保证在新机器能够跑通
3. 需要存储特定的文件，比如 chromemium


# 2、gitlab-ci.yml介绍
##2-1 总体介绍
.gitlab-ci.yml 是一个脚本文件，用来定义 runner 的执行脚本。需要放在项目的根目录
## 2-2 脚本书写
```
image: hwf/ci
cache:
  untracked: true
  key: "$CI_BUILD_REF_NAME"
  paths:
    - ./server/node_modules
    - ./web/node_modules
stages:
  - serverTest
  - webTest
  - webBuild
  - webDeploy
  - serverDeploy
before_script:
  # Install ssh-agent if not already installed, it is required by Docker.
  # (change apt-get to yum if you use a CentOS-based image)
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  # Run ssh-agent (inside the build environment)
  - eval $(ssh-agent -s)
  # Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - echo "$SSH_PRIVATE_KEY"
  - ssh-add <(echo "$SSH_PRODUCTION_KEY")
  # For Docker builds disable host key checking. Be aware that by adding that
  # you are suspectible to man-in-the-middle attacks.
  # WARNING: Use this only with the Docker executor, if you use it with shell
  # you will overwrite your user's SSH config.
  - mkdir -p ~/.ssh
  - echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
serverTest:
  image: hwf/ci
  stage: serverTest
  script:
    - cd server
    - cnpm install
    # 后端单元测试
    - npm run unit
    - npm run e2e
webTest:
  stage: webTest
  script:
    - redis-server --daemonize yes
    - cd server
    - npm run start-ci
    - cd ../web
    - cnpm install --ignore-scripts
    - cnpm install node-sass
    - cnpm rebuild node-sass
    - npm run test
webDevBuild:
  stage: webBuild
  artifacts:
    paths:
      - ./web/dist
  only:
    - develop@appDev/kuaikf
  script:
    - cd ./web
    # build在test环境下，master下面用npm run build
    - npm run build-test
webMasterBuild:
  stage: webBuild
  artifacts:
    paths:
      - ./web/dist
  only:
    - master@appDev/kuaikf
  script:
    - cd ./web
    # build在test环境下，master下面用npm run build
    - npm run build
webDevdeploy:
  stage: webDeploy
  environment:
    name: development
  only:
    - develop@appDev/kuaikf
  script:
    # dist后面加/ 则不创建该文件
    - rsync -avz --delete ./web/dist/ root@1.1.1.1:/var/www/kuaikf
webProdeploy:
  stage: webDeploy
  environment:
    name: production
  only:
    - master@appDev/kuaikf
  script:
    # dist后面加/ 则不创建该文件
    - rsync -avz --delete ./web/dist/ root@1.1.1.2:/root/tmpStorage/
serverDevDeploy:
  stage: serverDeploy
  environment:
    name: development
  only:
    - develop@appDev/kuaikf
  script:
    # dist后面加/ 则不创建该文件
    - rsync -avz --delete ./server/ root@1.1.1.1:/root/kuaikf/server
    - ssh root@192.168.1.71 'pm2 restart server'
serverProDeplpy:
  stage: serverDeploy
  environment:
    name: production
    url: https://apilab.gitlab.org
  only:
    - master@appDev/kuaikf
  script:
    # dist后面加/ 则不创建该文件
    - rsync -avz --delete ./server/ root@1.1.1.2:/root/tmpStorage/
    - ssh root@101.132.39.184 'cd /root/tmpStorage/testKuaikf/server && pm2 restart'

```
## 2-3 注意要点
1. 由于每个 stage 执行时会清空.gitignore 里的文件，所以需要用 cache。cache 用来缓存依赖，以 node_modules 为例，测试的 stage 需要依赖 node_modules，而 build 的时候也需要依赖
2. artificate 用来存储 build 以后的文件，可以在 gitlab-ci 的设置里面进行下载
![](http://ozi0avz2v.bkt.clouddn.com/17-11-16/51501385.jpg)
3. SSH_HOST_KEY 变量的存储需要在 gitlab 的 setting 里面进行设置
![](http://ozi0avz2v.bkt.clouddn.com/17-11-16/15075194.jpg)
4. 有一个脚本出现 faild，即停止，不会往下执行了。失败或成功都会发送邮件
5. only: - master@appDev/kuaikf 表示该脚本只在 appDev/kuaikf 仓库下的master分支下执行。因为部署的任务只需要在主仓库，其他 fork 下来的开发仓库都只跑测试脚本

# 3、docker 测试环境
## 3-1 dockerfile目录构成， 指令介绍
### 3-1-1 docker file 的目录构成
![](http://ozi0avz2v.bkt.clouddn.com/17-11-25/80147272.jpg)
chrome-linux: chrome内核的文件，用来做web自动化测试
source.list: 换ubuntu的安装仓库源
### 3-1-2 指令介绍
FROM: 拉取镜像
RUN: 执行脚本
ADD: 添加文件到构建环境中

## 3-2 dockerfile 文件书写
```
FROM ubuntu:16.04
# add custom china source
ADD sources.list /etc/apt/
RUN apt-get update && apt-get install -y openssh-server
RUN apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget redis-server rsync curl autoclean
# add account
RUN mkdir /var/run/sshd
RUN echo 'root:123456' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# set node environment
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.9.1

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# install node and npm and cnpm
RUN source $NVM_DIR/nvm.sh \
    && NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node/ nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
#add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#npm change source
RUN node -v && npm -v
RUN npm config set registry https://registry.npm.taobao.org

# install common tool,insatll java
RUN apt-get install -yq iputils-ping tmux vim redis-server rsync

#install npm common tool
RUN npm install vue-cli -g
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN npm install -g forever
RUN mkdir /tmp/chrome-linux
# install python for node_modules
RUN apt-get install -y python python-dev python-pip python-virtualenv
COPY chrome-linux /tmp/chrome-linux

EXPOSE 22 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010
CMD ["/usr/sbin/sshd", "-D"]
```
构建镜像
```
cd /ci
sudo docker build -t ci/latest .
```
## 3-3 注意事项
1、docker 拉取镜像慢时，要换源
```
vim /etc/docker/daemon.json
     {
      "registry-mirrors": [
        "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
      ]
    }
// restart docker server
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```
2、拉取的 ubuntu 系统换中科大源, 在同级目录增加 source.list,并写入
```
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
deb http://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-security main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-proposed main restricted universe multiverse
deb-src http://mirrors.ustc.edu.cn/ubuntu/ xenial-backports main restricted universe multiverse
```
3、nvm 下载 node 速度较慢，可以通过换源解决
```
NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node/ nvm install $NODE_VERSION
```

# 4、前后端测试
## 4-1 后端单元测试+接口测试
用 mocha + chai， 先对单元进行测试，测试通过，再跑接口测试，全都通过则结束
### 4-1-1 单元测试
单元测试主要测试每个子函数的输出结果是否满足需求。
```
var { testAccount } = require('./testAccount.js')
var expect = require('chai').expect
describe('测试查询账号函数', () => {
  it('查询id为1的账号，该数值应该返回1', async () => {
    expect(await testAccount(1)).to.be.equal(1)
  })
})
```
### 4-1-2 接口测试
主要测试接口是否符合规范，是否满足各种边界条件的输出。这里采用了 supertest 框架来测试。
```
const request = require('supertest')
const app = require('../../app.js')
const token = '***********'

describe('测试登陆的post查询', () => {
  it('return code 0', (done) => {
    request(app)
      .post('/api/login')
      .send({
        email: '*****@qq.com',
        password: '***',
        domain: '**.kuaishangkf.com'
      })
      .set('Accept', 'application/json')
      .expect(res => {
        if (res.body.code !== 0) {
          throw new Error(`code error: ${JSON.stringify(res.body)}`)
        }
      })
      .end(done)
  })
})
 describe('测试发送重置密码的get查询', () => {
   it('return code 0', (done) => {
    request(app)
      .get('/api/login/changePasswordEmail')
      .query({email: '463815567@qq.com'})
      .expect(res => {
        if (res.body.code !== 0) {
          throw new Error(`code error: ${JSON.stringify(res.body)}`)
        }
    })
    .end(done)
  })
})
describe('测试getKf的graphql的query接口', () => {
  let email = '463815567@qq.com'
  let query = {
    query: `
    {
      getPersonData(
        token:"${token}"
        email:"${email}"
      ) {
        code
        data {
          id
          name
          email
          nick
          role
          reception_limit
          role_id
          is_main_account
          activate_status
        }
      }
    }
    `
  }
  it('return query code 0', (done) => {
    request(app)
      .get('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .query(query)
      .expect(res => {
        if (res.body.data.getPersonData.code !== 0) {
          throw new Error(`code error: ${JSON.stringify(res.body)}`)
        }
      })
      .end(done)
  })
})
```
***注意事项***
####1. 测试脚本启动监听端口，
test 的 file 里面 app 是 express 的服务器，直接引用的话会执行
```
const app = require('../../app.js')
request(app)
    .get()
    .done()
request(app)
    .post()
    .done()
```
在 app.js中
```
  app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
  })
  module.exports = app

```
程序会开启监听3000端口，而每个测试都会起一个新的服务监听3000端口，而之前的3000端口不会自动关闭，所以会报端口占用的错误， 所以要在原有的 app.js 要增加
```
if (!module.parent) {
  app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
  })
}
```
这段程序的作用是: 只有在执行执行 app.js 时才会开启监听3000端口，其他直接引用的都不会启动监听端口

## 4-2 前端自动化测试
1. 利用 puppeteer，用 chrome 内核模拟登录的状态流程
测试登陆脚本
```
const puppeteer = require('puppeteer')
let login = async () => {
  try {
    // 线上的地址和本地的地址不一样
    const browser = await puppeteer.launch(
      {
        executablePath: '/tmp/chrome-linux/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    )
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:3000/#/login')
    await page.type('#login-domain input ', '***')
    await page.type('#login-name input', '463815567@qq.com')
    await page.type('#login-password input', '****')
    await page.click('#login-button button')
    await page.screenshot({path: 'example1.png'})
    await page.waitForSelector('#sidebar-user')
    await browser.close()
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}
module.exports = login
```
# 5、 自动部署
## 5-1 自动部署命令介绍
主要使用了 rsync 和 ssh
rsync 是 linux 下面的远程资料同步工具
```
rsync -avz --delete ./server/ root@1.1.1.1:/root/tmpStorage/
ssh root@101.132.39.184 'cd /root/tmpStorage/testKuaikf/server && pm2 restart'
```

## 5-2 SSH 配置
1、正常的 ssh 流程，应该是本地生成公钥秘钥以后，将公钥放在服务器上，然后实现免密码登录。在runner里面由于是全新环境，每次都会清空 ./ssh，所以我们这里我们采用拿服务器的私钥进行登陆验证
![](http://ozi0avz2v.bkt.clouddn.com/17-11-16/15075194.jpg)
2、将服务器的私钥存在 Gitlab-CI 的设置里面，命名为 SSH_PRIVATE_KEY]，在 runner 里面可以直接引用变量。

```
- 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
# Run ssh-agent (inside the build environment)
- eval $(ssh-agent -s)
# Add the SSH key stored in SSH_PRIVATE_KEY variable to the agent store
- ssh-add <(echo "$SSH_PRIVATE_KEY")
- ssh-add <(echo "$SSH_PRODUCTION_KEY")
# For Docker builds disable host key checking. Be aware that by adding that
# you are suspectible to man-in-the-middle attacks.
# WARNING: Use this only with the Docker executor, if you use it with shell
# you will overwrite your user's SSH config.
- mkdir -p ~/.ssh
- echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
```
3、在服务器上需要把服务器本身的公钥复制到 .ssh/authorized_keys 里面
