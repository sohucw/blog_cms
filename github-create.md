添加到github中相关步骤

1. 在github创建一个资源库：hopefuture-blog
2. 在当前项目路径下
    - 初始化 git： git init
    - 添加： git add -A 或 git add .
    - 提交： git commit -m "Init the hope future blog project."
    - 绑定 github远程仓库（我们用ssh方式，这样每次提交不用输入密码）：
    
        > git remote add origin git@github.com:linder0209/hopefuture-blog.git
    - 提交到服务器端：git push origin master
  这里需要注意的是：如果我们在github中创建资源库的时候添加了readme.md等文件，在提交到服务器之前需要git pull，执行以下命令

        > git pull git@github.com:linder0209/hopefuture-blog.git master
        
    - 设置 git push 直接提交到远程仓库中可以执行以下命令（origin 也可以设置为其他名字）

         > git push --set-upstream origin master
3. 我们也可以直接用以下命令先把远程代码clone到本地，再add commit。这种方式比较简单一些

   > git clone git@github.com:linder0209/hopefuture-blog.git

4. 创建分支

   ```
   git branch v0.0.1 创建本地分支
   git checkout v0.0.1 切换到本地分支
   git merge -m "Merge from master" master 合并分支（需要的话）
   git push --set-upstream origin v0.0.1 提交到服务器端
   ```
   
5. 创建tag（所创建的tag指向所在的分支，这里创建轻量级的tag）

   http://blog.csdn.net/wh_19910525/article/details/7470850
   
   只有创建了tag后，在Bower中注册的包才会指向当前version
   
   ```
   git tag 0.0.1   创建tag
   git push origin --tags    提交的服务器端（github）上
   git tag -d 0.0.1     删除本地tag
   git push origin :refs/tags/0.0.1     删除远程tag
   ```
