<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with('user')
            ->where('is_approved', true)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Home', [
            'comments' => $comments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:10|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'rating' => $validated['rating'],
            'is_approved' => false, // Comments need approval by default
        ]);

        // Get the latest 10 approved comments
        $comments = Comment::with('user')
            ->where('is_approved', true)
            ->latest()
            ->take(10)
            ->get();

        return back()->with([
            'comments' => $comments,
            'message' => 'Your comment has been submitted and is pending approval.'
        ]);
    }

    public function approve(Comment $comment)
    {
        $comment->update(['is_approved' => true]);
        return back()->with('message', 'Comment approved successfully.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return back()->with('message', 'Comment deleted successfully.');
    }
} 