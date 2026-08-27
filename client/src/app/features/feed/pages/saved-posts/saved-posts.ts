import { Component, OnInit, inject, signal } from '@angular/core';
import { PostService } from '../../../post/services/post-service';
import { Post } from '../../../post/models/post.model';
import { DatePipe } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';

@Component({
  imports: [DatePipe, CommentComponent],
  selector: 'app-saved-posts',
  styleUrl: './saved-posts.css',
  templateUrl: './saved-posts.html',
  standalone: true
})
export class SavedPosts implements OnInit{
  private readonly postService = inject(PostService)

  protected readonly posts = signal<Post[]>([])
  protected readonly isLoading = signal(true)

  ngOnInit(): void {
      this.loadSavedPosts()
  }

  private loadSavedPosts(): void{
    this.postService.getSavedPosts().subscribe({
      next: (response) =>{
        this.posts.set(response.data.data ?? [])
        this.isLoading.set(false)
      },
      error: (err)=>{
        console.error('Failed to fetch Saved Posts: ' , err);
        this.isLoading.set(false)
      },
    })
  }

  protected getAuthorName(author: any): string{
    if(!author) return 'Anonymouse'

    if(typeof author === 'object'){
      return author.name || author.username
    }
    return String(author)
  }

  protected getAuthorAvatar(author: any): string{
    if(typeof author === 'object' && author?.avatar){
      const avatar = author.avatar
      return avatar.startsWith('http') 
        ? avatar : `http://localhost:3000${avatar}`
    }

    const seed = typeof author === 'string'
      ? author : author?.username || 'user'
    return `https://picsum.photos/seed/${seed}/80/80` 
  }

  protected unsavePost (post: Post): void{
    this.postService.unsavePost(post._id).subscribe({
      next:() =>{
        this.posts.update((posts) => 
          posts.filter((p) => p._id !== post._id)  
        )
      },
      error: (err)=>{
        console.error('Failed to unsave post: ',err);
      }
    })
  }

  
}
