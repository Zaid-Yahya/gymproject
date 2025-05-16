<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $comments = [
            [
                'content' => 'Amazing gym! The equipment is top-notch and the trainers are incredibly knowledgeable. I\'ve seen great results in just 3 months!',
                'rating' => 5
            ],
            [
                'content' => 'Great atmosphere and friendly staff. The classes are challenging but fun. Would definitely recommend!',
                'rating' => 4
            ],
            [
                'content' => 'The facilities are clean and well-maintained. Love the variety of equipment available.',
                'rating' => 5
            ],
            [
                'content' => 'Excellent personal training sessions. My trainer really knows how to push me to achieve my goals.',
                'rating' => 5
            ],
            [
                'content' => 'The group classes are fantastic! High energy and great instructors.',
                'rating' => 4
            ],
            [
                'content' => 'Very professional environment. The staff is always helpful and the members are supportive.',
                'rating' => 5
            ],
            [
                'content' => 'Great value for money. The membership includes access to all facilities and classes.',
                'rating' => 4
            ],
            [
                'content' => 'The gym has everything I need for my fitness journey. Clean, modern, and well-equipped.',
                'rating' => 5
            ]
        ];

        foreach ($comments as $comment) {
            Comment::create([
                'user_id' => $users->random()->id,
                'content' => $comment['content'],
                'rating' => $comment['rating'],
                'is_approved' => true
            ]);
        }
    }
} 