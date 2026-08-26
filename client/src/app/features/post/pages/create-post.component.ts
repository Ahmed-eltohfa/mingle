import { Component, EventEmitter, OnDestroy, Output, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { PostService } from '../services/post-service';
import { Post } from '../models/post.model';

interface MediaPreview {
  url: string;
  type: 'image' | 'video';
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB, matches server-side multer limit

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnDestroy {
  private readonly postService = inject(PostService);

  @Output() created = new EventEmitter<Post>();

  protected readonly isSubmitting = signal(false);
  protected readonly selectedFiles = signal<File[]>([]);
  protected readonly mediaPreviews = signal<MediaPreview[]>([]);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly postForm = new FormGroup({
    content: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    visibility: new FormControl<'public' | 'private' | 'followers'>('public', { nonNullable: true }),
    altText: new FormControl('', { nonNullable: true })
  });

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const incoming = Array.from(input.files);
    // Reset the input so selecting the same file again later still fires a change event.
    input.value = '';

    const tooBig = incoming.filter(file => file.size > MAX_FILE_SIZE);
    if (tooBig.length) {
      this.errorMessage.set('Each file must be 50 MB or smaller.');
    }

    const validIncoming = incoming.filter(file => file.size <= MAX_FILE_SIZE);
    const combined = [...this.selectedFiles(), ...validIncoming].slice(0, MAX_FILES);

    if (this.selectedFiles().length + validIncoming.length > MAX_FILES) {
      this.errorMessage.set(`You can attach up to ${MAX_FILES} files.`);
    }

    this.setSelectedFiles(combined);
  }

  protected removeFile(index: number): void {
    const previewToRemove = this.mediaPreviews()[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    this.setSelectedFiles(this.selectedFiles().filter((_, i) => i !== index));
  }

  protected submit(): void {
    if (this.postForm.invalid || this.isSubmitting()) return;

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.postService.createPost({
      content: this.postForm.controls.content.value,
      visibility: this.postForm.controls.visibility.value,
      altText: this.postForm.controls.altText.value,
      files: this.selectedFiles()
    })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          this.postForm.reset({ content: '', visibility: 'public', altText: '' });
          this.clearSelectedFiles();
          this.created.emit(res.data);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to publish post:', err);
          this.errorMessage.set(err.error?.message || 'Failed to publish post. Please try again.');
        }
      });
  }

  ngOnDestroy(): void {
    this.clearSelectedFiles();
  }

  private setSelectedFiles(files: File[]): void {
    // Revoke previous object URLs before generating new ones to avoid leaking memory.
    this.mediaPreviews().forEach(preview => URL.revokeObjectURL(preview.url));

    this.selectedFiles.set(files);
    this.mediaPreviews.set(files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    })));
  }

  private clearSelectedFiles(): void {
    this.mediaPreviews().forEach(preview => URL.revokeObjectURL(preview.url));
    this.selectedFiles.set([]);
    this.mediaPreviews.set([]);
  }
}