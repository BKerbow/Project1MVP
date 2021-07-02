package dev.kerbow.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import dev.kerbow.models.Author;
import dev.kerbow.models.Editor;
import dev.kerbow.models.GEJoin;
import dev.kerbow.models.Genre;
import dev.kerbow.models.Messages;
import dev.kerbow.models.Story;
import dev.kerbow.models.StoryType;

import dev.kerbow.repositories.AuthorRepo;
import dev.kerbow.repositories.EditorRepo;
import dev.kerbow.repositories.GEJoinRepo;
import dev.kerbow.repositories.GenreRepo;
import dev.kerbow.repositories.MessagesRepo;
import dev.kerbow.repositories.StoryRepo;
import dev.kerbow.repositories.StoryTypeRepo;
import dev.kerbow.services.AuthorServices;
import dev.kerbow.services.EditorServices;
import dev.kerbow.services.GEJoinServices;
import dev.kerbow.services.GenreServices;
import dev.kerbow.services.StoryServices;
import dev.kerbow.services.StoryTypeServices;
import dev.kerbow.utils.Utils;

public class FrontControllerServlet extends HttpServlet {
	
	
	class LoginInfo {
		public String username;
		public String password;
	}

	public FrontControllerServlet() {
		GEJoinServices.loadEntries();
	}

	private Gson gson = new Gson();
	public static HttpSession session;
	

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(Story.class, new Story.Deserializer());
//		gsonBuilder.registerTypeAdapter(Author.class, new Author.Deserializer());
		gsonBuilder.registerTypeAdapter(Messages.class, new Messages.Deserializer());
		gsonBuilder.setDateFormat("yyyy-MM-dd");
		this.gson = gsonBuilder.create();

		String uri = request.getRequestURI();
		System.out.println(uri);
		String json = "";

		response.setHeader("Access-Control-Allow-Origin", "*");		// Needed to avoid CORS violations
		response.setHeader("Content-Type", "application/json");		// Needed to enable json data to be passed between front and back end

		session = request.getSession();

		uri = uri.substring("/Project1/FrontController/".length());
		switch (uri) {
		case "get_story_types": {
			List<StoryType> types = StoryTypeServices.getInstance().getAllList();
			List<Genre> genres = GenreServices.getInstance().getAllList();
			Author a = (Author) session.getAttribute("logged_in");
			String[] jsons = new String[] { this.gson.toJson(types), this.gson.toJson(genres), this.gson.toJson(a) };
			json = gson.toJson(jsons);
			response.getWriter().append(json);
			break;
		}
		case "get_author_stories":{
			System.out.println("grabbing author stories");
			List<Story> stories = new ArrayList<Story>(new StoryRepo().getAll().values());
			Author a = (Author) session.getAttribute("logged_in");
			String[] jsons = new String[] { this.gson.toJson(stories), this.gson.toJson(a)};
			json = this.gson.toJson(a) + "|" + this.gson.toJson(stories);
			response.getWriter().append(json);
			System.out.print(jsons[0] + " " + jsons[1]);
			break;
		}
//		case "get_draft_requests": {
//			System.out.println("grabbing draft requests");
//			Editor e = (Editor) session.getAttribute("logged_in");
//			List<Story> stories = StoryServices.getInstance().getAllWithDraftsForEditor(e);
//			String[] jsons = new String[] {this.gson.toJson(stories), this.gson.toJson(e)};
//			json = this.gson.toJson(e) + "|" + this.gson.toJson(stories);
//			response.getWriter().append(json);
//			System.out.print(jsons[0] + " " + jsons[1]);
//			break;
//		}
		case "get_draft_requests": {
			Editor e = (Editor) session.getAttribute("logged_in");
			List<Story> stories = StoryServices.getInstance().getAllWithDraftsForEditor(e);
			//json = this.gson.toJson(stories);
			//response.getWriter().append(json);
			
			String flag = "general|";
			if (e.getAssistant()) flag = "assistant|";
			else if (e.getSenior()) flag = "senior|";
			json = flag + this.gson.toJson(stories);
			
			response.getWriter().append(json);
			break;
		}
		case "get_editor_messages":{
			System.out.println("grabbing editor messages");
			List<Messages> messages = new ArrayList<Messages>(new MessagesRepo().getAll().values());
			Author a = (Author) session.getAttribute("logged_in");
			//String[] mjson = new String[] { this.gson.toJson(messages), this.gson.toJson(a) };
			json = gson.toJson(messages) + "|" + this.gson.toJson(a);
			System.out.println(json);
			response.getWriter().append(json);
			break;
		}
		case "get_author_messages":{
			System.out.println("grabbing author messages");
			List<Messages> messages = new ArrayList<Messages>(new MessagesRepo().getAll().values());
			Editor e = (Editor) session.getAttribute("logged_in");
			//String[] amjson = new String[] { this.gson.toJson(messages), this.gson.toJson(e) };
			json = gson.toJson(messages) + "|" + this.gson.toJson(e);
			System.out.println(json);
			response.getWriter().append(json);
			break;
		}
		case "get_other_editor_messages":{
			System.out.println("grabbing editor messages");
			List<Messages> messages = new ArrayList<Messages>(new MessagesRepo().getAll().values());
			messages.forEach((m) -> System.out.println(m));
			Editor e = (Editor) session.getAttribute("logged_in");
			//String[] mjson = new String[] { this.gson.toJson(messages), this.gson.toJson(e)};
			json = gson.toJson(e) + "|" + this.gson.toJson(messages);
			System.out.print(json);
			response.getWriter().append(json);
			break;
		}
		case "get_proposals": {
			Object logged_in = session.getAttribute("logged_in");
			if (logged_in instanceof Author) {
				Author a = (Author) logged_in;
				List<Story> stories = StoryServices.getInstance().getAllByAuthor(a.getId());
				json = "author|" + this.gson.toJson(stories);
				response.getWriter().append(json);
			} else if (logged_in instanceof Editor) {
				Editor e = (Editor) session.getAttribute("logged_in");
				Set<Genre> genres = GEJoinServices.getGenres(e);
				List<Story> stories = new ArrayList<Story>();
				
				for (Genre g : genres) {
					if(e.getSenior()) {
						stories.addAll(new StoryRepo().getAllByGenreAndStatus(g, "approved_editor"));
					} else if(e.getAssistant()) {
						stories.addAll(new StoryRepo().getAllByGenreAndStatus(g, "submitted"));
					} else {
						String status = "approved_assistant";
						if (g.getName().equals("fantasy")) {
							Genre scienceFiction = new GenreRepo().getByName("science-fiction");
							stories.addAll(new StoryRepo().getAllByGenreAndStatus(scienceFiction, status));
						} else if (g.getName().equals("science-fiction")) {
							Genre mystery = new GenreRepo().getByName("mystery");
							stories.addAll(new StoryRepo().getAllByGenreAndStatus(mystery, status));
						} else if (g.getName().equals("mystery")) {
							Genre article = new GenreRepo().getByName("article");
							stories.addAll(new StoryRepo().getAllByGenreAndStatus(article, status));
						} else if (g.getName().equals("article")) {
							Genre nonfiction = new GenreRepo().getByName("nonfiction");
							stories.addAll(new StoryRepo().getAllByGenreAndStatus(nonfiction, status));
						} else if (g.getName().equals("nonfiction")) {
							Genre fantasy = new GenreRepo().getByName("fantasy");
							stories.addAll(new StoryRepo().getAllByGenreAndStatus(fantasy, status));
						}
					}
				}
				
				String flag = "general|";
				if (e.getAssistant()) flag = "assistant|";
				else if (e.getSenior()) flag = "senior|";
				json = flag + this.gson.toJson(stories);
				
				response.getWriter().append(json);
			}
			break;
		}
		case "get_story_from_session": {
			JsonObject sj = (JsonObject) session.getAttribute("story");
			String str = "";
			Object logged_in = session.getAttribute("logged_in");
			if (logged_in instanceof Author) {
				str = "author|";
			} else {
				str = "editor|";
			}
			response.getWriter().append(str + sj.toString());
			break;
		}
		case "deny_story": {
			Object logged_in = session.getAttribute("logged_in");
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			if (logged_in instanceof Author && s.getModified()) {
				StoryServices.getInstance().deleteStory(s);
				Author a = (Author) logged_in;
				AuthorServices.getInstance().addPoints(a, s.getType().getPoints());
				StoryServices.getInstance().submitNextWaitingProposal(a);
			} else StoryServices.getInstance().updateStory(s);
			break;
		}
		case "request_info": {
			String[] strs = this.gson.fromJson(request.getReader(), String[].class);
			Story s = this.gson.fromJson(strs[0], Story.class);
			String receiverName = this.gson.fromJson(strs[1], String.class);
			s.setReceiverName(receiverName);
			StoryServices.getInstance().updateStory(s);
			System.out.println("Requesting info!!! " + s);
			break;
		}
//	case "get_draft_requests": {
//			Editor e = (Editor) session.getAttribute("logged_in");
//			List<Story> stories = StoryServices.getInstance().getAllWithDraftsForEditor(e);
//			json = this.gson.toJson(stories);
//			response.getWriter().append(json);
//			break;
//		}
		case "update_details": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			StoryServices.getInstance().updateStory(s);
			// notify author somehow
			break;
		}
		case "submit_draft": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			StoryServices.getInstance().updateStory(s);
			break;
		}
		case "update_draft": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			System.out.println("Updating draft: " + s.getTitle() + " d: " + s.getDraft());
			s.setRequest(null);
			s.setModified(false);
			StoryServices.getInstance().updateStory(s);
			break;
		}
		case "deny_draft": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			StoryServices.getInstance().deleteStory(s);
			StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
			break;
		}
		case "request_draft_change": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			StoryServices.getInstance().updateStory(s);
			break;
		}
		default: break;
	}
}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(Story.class, new Story.Deserializer());
		//		gsonBuilder.registerTypeAdapter(Author.class, new Author.Deserializer());
		gsonBuilder.registerTypeAdapter(Messages.class, new Messages.Deserializer());
		gsonBuilder.setDateFormat("yyyy-MM-dd");
		this.gson = gsonBuilder.create();

		String uri = request.getRequestURI();
		System.out.println(uri);
		String json;

		response.setHeader("Access-Control-Allow-Origin", "*");		// Needed to avoid CORS violations
		response.setHeader("Content-Type", "application/json");		// Needed to enable json data to be passed between front and back end

		session = request.getSession();

		uri = uri.substring("/Project1/FrontController/".length());
		switch (uri) {
		case "author_login": {
			System.out.println("I got the author login!");
			LoginInfo info = this.gson.fromJson(request.getReader(), LoginInfo.class);
			Author a = AuthorServices.getInstance().getByUsernameAndPassword(info.username, info.password);
			if (a != null) {
				System.out.println("The Author " + a.getFirstName() + " has logged in!");
				session.setAttribute("logged_in", a);
				response.getWriter().append("authors.html");
				System.out.println("Author Logged In.");
			} else {
				System.out.println("Failed to login with provided credentials credentials: username=" + info.username + " password=" + info.password);
			}
			break;
		}
		case "editor_login": {
			System.out.println("I got the Editor login!");
			LoginInfo info = this.gson.fromJson(request.getReader(), LoginInfo.class);
			Editor e = EditorServices.getInstance().getByUsernameAndPassword(info.username, info.password);
			if (e != null) {
				System.out.println("The Editor " + e.getFirstName() + " has logged in!");
				session.setAttribute("logged_in", e);
				response.getWriter().append("editors.html");
				System.out.println("Editor Logged In.");
			} else {
				System.out.println("Failed to login with provided credentials credentials: username=" + info.username + " password=" + info.password);
			}
			break;
		}
		case "logout": {
			String pageURL = "";
			Object loggedIn	= session.getAttribute("logged_in");
			if(loggedIn instanceof Author) pageURL = "index.html";
			if(loggedIn instanceof Editor) pageURL = "index.html";
			System.out.println("Logging you out!");
			response.getWriter().append("index.html");
			session.invalidate();
			break;
		}
		case "author_signup": {
			System.out.println("Received author sign up!");
			Author a = this.gson.fromJson(request.getReader(), Author.class);
			if (a != null) {
				a = new AuthorRepo().add(a);
				System.out.println("Created the new author " + a + " and logged in!");
				session.setAttribute("logged_in", a);
				response.getWriter().append("authors.html");
			} else {
				System.out.println("Failed to create new Author account!");
			}
			break;
		}
		case "editor_signup": {
			System.out.println("Received Editor Sign Up!");
			Editor e = this.gson.fromJson(request.getReader(), Editor.class);
			if(e != null) {
				e = new EditorRepo().add(e);
				System.out.println("Created the new editor " + e + "and logged in!");
				session.setAttribute("logged_in", e);
				response.getWriter().append("editors.html");
			} else {
				System.out.println("Failed to create new Editor account!");
			}
			break;
		}
		case "submit_story_form": {
			Story story = this.gson.fromJson(request.getReader(), Story.class);
			Author a = (Author) session.getAttribute("logged_in");
			if (a.getPoints() < story.getType().getPoints()) {
				story.setApprovalStatus("waiting");
			} else {
				story.setApprovalStatus("submitted");
				AuthorServices.getInstance().subtractPoints(a, story.getType().getPoints());
			}
			story.setAuthor(a);
			story.setModified(false);
			story.setDraftApprovalCount(0);
			story = StoryServices.getInstance().addStory(story);
			System.out.println(story);
			break;
		}
		case "submit_draft_update":{
			Object logged_in = session.getAttribute("logged_in");
			if (logged_in instanceof Author) {
			System.out.println("I got the new version!");
			Story s = gson.fromJson(request.getReader(), Story.class);
			Author a = (Author) session.getAttribute("logged_in");
			System.out.println(session.getAttribute("story"));
			System.out.println(s);
			s.setAuthor(a);
			StoryServices.getInstance().updateStory(s);
			System.out.println("Updated the old version with the new version!");
			response.getWriter().append("authors.html");
			} else if (logged_in instanceof Editor) {
				System.out.println("I got the rejection notice!");
				Story s = gson.fromJson(request.getReader(), Story.class);
				Editor e = (Editor) session.getAttribute("logged_in");
				StoryServices.getInstance().updateStory(s);
				response.getWriter().append("editors.html");
			}
			break;
		}
		case "approve_story": {
			Editor e = (Editor) session.getAttribute("logged_in");
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			StoryServices.getInstance().incrementApprovalStatus(s, e);
			break;
		}
		
		case "save_story_to_session": {
			JsonElement root = JsonParser.parseReader(request.getReader());
			session.setAttribute("story", root.getAsJsonObject());
			response.getWriter().append("saved");
			break;
		}
		case "save_message_to_session":{
			System.out.println("In Save_Message_to_Session");
			JsonElement root = JsonParser.parseReader(request.getReader());
			session.setAttribute("message", root.getAsJsonObject());
			response.getWriter().append("saved");
			break;
		}
		
		case "post_info_request":{
			System.out.println("Posting Story Request!");
			JsonElement[] objs = gson.fromJson(request.getReader(), JsonElement[].class);
			System.out.print(objs[1]);
			Story s = gson.fromJson(objs[0], Story.class);
			Messages m = gson.fromJson(objs[1], Messages.class);
			new MessagesRepo().add(m);
			break;
		}
		case "reject_script":{
			JsonElement objs = gson.fromJson(request.getReader(), JsonElement.class);
			System.out.print(objs);
			Story s = gson.fromJson(objs, Story.class);
			s.setApprovalStatus("submitted");
			new StoryRepo().update(s);
			break;
		}
		case "approve_draft": {
			Story s = this.gson.fromJson(request.getReader(), Story.class);
			String type = s.getType().getName();
			System.out.println("Approving draft for type " + type);
			switch (type) {
				case "novel":
				case "novella": {
					Set<Editor> editors = GEJoinServices.getEditors(s.getGenre());
					Integer count = s.getDraftApprovalCount();
					count++;
					s.setDraftApprovalCount(count);
					float avg = (float) count / (float) editors.size();
					if (avg > 0.5f) {
						s.setApprovalStatus("Approved");
						AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
						StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
					}
					StoryServices.getInstance().updateStory(s);
					break;
				}
				case "short story": {
					System.out.println("short story");
					Integer count = s.getDraftApprovalCount();
					count++;
					s.setDraftApprovalCount(count);
					if (count == 2) {
						s.setApprovalStatus("Approved");
						AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
						StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
					}
					StoryServices.getInstance().updateStory(s);
					break;
				}
				case "article": {
					System.out.println("in approval for article");
					s.setApprovalStatus("approved");
					s.setDraftApprovalCount(1);
					AuthorServices.getInstance().addPoints(s.getAuthor(), s.getType().getPoints());
					StoryServices.getInstance().submitNextWaitingProposal(s.getAuthor());
					StoryServices.getInstance().updateStory(s);
					break;
				}
			}
			break;
		}
		default: System.out.println("Sorry, I didn't get that POST flag."); break;

		}
	}
}