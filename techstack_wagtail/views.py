from django.http import JsonResponse
import json

def api_events(request):
    """
    API endpoint to serve upcoming events data.
    """
    data = [
        {
            "slug": "annual-tech-summit-2024",
            "title": "Annual Tech Summit 2024",
            "date": "October 26, 2024",
            "location": "SMX Convention Center, Manila",
            "imageUrl": "https://picsum.photos/seed/event-1/600/400"
        },
        {
            "slug": "hackathon-for-social-good",
            "title": "Hackathon for Social Good",
            "date": "November 15, 2024",
            "location": "Online",
            "imageUrl": "https://picsum.photos/seed/event-2/600/400"
        },
        {
            "slug": "intro-to-web-dev-workshop",
            "title": "Intro to Web Dev Workshop",
            "date": "September 28, 2024",
            "location": "TechStackPH HQ, BGC, Taguig",
            "imageUrl": "https://picsum.photos/seed/event-3/600/400"
        }
    ]
    return JsonResponse(data, safe=False)

def api_blog(request):
    """
    API endpoint to serve latest blog posts.
    """
    data = [
        {
            "slug": "techstackph-partners-with-tech-giant",
            "title": "TechStackPH Announces Partnership with a Global Tech Giant",
            "author": "Jane Doe",
            "date": "July 15, 2024",
            "imageUrl": "https://picsum.photos/seed/news-1/600/400"
        },
        {
            "slug": "bootcamp-graduate-lands-dream-job",
            "title": "Bootcamp Graduate Lands Dream Job at a Top Tech Company",
            "author": "John Smith",
            "date": "July 10, 2024",
            "imageUrl": "https://picsum.photos/seed/news-2/600/400"
        },
        {
            "slug": "the-future-of-tech-in-the-philippines",
            "title": "The Future of Tech in the Philippines: A 2024 Outlook",
            "author": "Jane Doe",
            "date": "July 05, 2024",
            "imageUrl": "https://picsum.photos/seed/news-3/600/400"
        }
    ]
    return JsonResponse(data, safe=False)

def api_programs(request):
    """
    API endpoint to serve featured programs.
    """
    data = [
        {
            "slug": "coding-bootcamp",
            "title": "Full-Stack Coding Bootcamp",
            "description": "An intensive 12-week program covering modern web development technologies.",
            "imageUrl": "https://picsum.photos/seed/program-1/600/400"
        },
        {
            "slug": "digital-literacy",
            "title": "Digital Literacy for All",
            "description": "Basic computer and internet skills for underserved communities.",
            "imageUrl": "https://picsum.photos/seed/program-2/600/400"
        },
        {
            "slug": "tech-startup-incubator",
            "title": "Tech Startup Incubator",
            "description": "Supporting early-stage startups with mentorship, resources, and funding.",
            "imageUrl": "https://picsum.photos/seed/program-3/600/400"
        }
    ]
    return JsonResponse(data, safe=False)

def api_contact(request):
    """
    API endpoint for the contact form.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # In a real app, you would process the data (e.g., send an email)
            print("Contact form submitted:", data)
            return JsonResponse({'message': 'Thank you for your message. We will get back to you shortly.'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON.'}, status=400)
    return JsonResponse({'message': 'Invalid request method.'}, status=405)

def api_subscribe(request):
    """
    API endpoint for the newsletter subscription form.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # In a real app, you would add the email to your mailing list
            print("New subscriber:", data.get('email'))
            return JsonResponse({'message': 'Thank you for subscribing!'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON.'}, status=400)
    return JsonResponse({'message': 'Invalid request method.'}, status=405)

def api_volunteer(request):
    """
    API endpoint for the volunteer application form.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # In a real app, you would process the application
            print("New volunteer application:", data)
            return JsonResponse({'message': 'Thank you for your application! We will review it and get in touch.'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON.'}, status=400)
    return JsonResponse({'message': 'Invalid request method.'}, status=405)
