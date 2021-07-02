package dev.kerbow.models;

import java.lang.reflect.Type;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import dev.kerbow.repositories.AuthorRepo;
import dev.kerbow.repositories.EditorRepo;
import dev.kerbow.repositories.StoryRepo;

public class Messages {
	private Integer id;
	private Story title;
	private Editor fromEditor;
	private Author author;
	private Editor receiveEditor;
	private String editorMessage;
	private String authorMessage;
	
	public Messages() {}
	
	public Messages(Story title, Editor editor, Author author) {
		this.title = title;
		this.fromEditor = editor;
		this.author = author;
		
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Story getTitle() {
		return title;
	}

	public void setTitle(Story title) {
		this.title = title;
	}

	public Editor getFromEditor() {
		return fromEditor;
	}

	public void setFromEditor(Editor editor) {
		this.fromEditor = editor;
	}

	public Author getAuthor() {
		return author;
	}

	public void setAuthor(Author author) {
		this.author = author;
	}

	public Editor getReceiveEditor() {
		return receiveEditor;
	}

	public void setReceiveEditor(Editor receiveEditor) {
		this.receiveEditor = receiveEditor;
	}

	public String getEditorMessage() {
		return editorMessage;
	}

	public void setEditorMessage(String editorMessage) {
		this.editorMessage = editorMessage;
	}

	public String getAuthorMessage() {
		return authorMessage;
	}

	public void setAuthorMessage(String authorMessage) {
		this.authorMessage = authorMessage;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((author == null) ? 0 : author.hashCode());
		result = prime * result + ((authorMessage == null) ? 0 : authorMessage.hashCode());
		result = prime * result + ((editorMessage == null) ? 0 : editorMessage.hashCode());
		result = prime * result + ((fromEditor == null) ? 0 : fromEditor.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((receiveEditor == null) ? 0 : receiveEditor.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Messages other = (Messages) obj;
		if (author == null) {
			if (other.author != null)
				return false;
		} else if (!author.equals(other.author))
			return false;
		if (authorMessage == null) {
			if (other.authorMessage != null)
				return false;
		} else if (!authorMessage.equals(other.authorMessage))
			return false;
		if (editorMessage == null) {
			if (other.editorMessage != null)
				return false;
		} else if (!editorMessage.equals(other.editorMessage))
			return false;
		if (fromEditor == null) {
			if (other.fromEditor != null)
				return false;
		} else if (!fromEditor.equals(other.fromEditor))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (receiveEditor == null) {
			if (other.receiveEditor != null)
				return false;
		} else if (!receiveEditor.equals(other.receiveEditor))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Messages [id=" + id + ", title=" + title + ", fromEditor=" + fromEditor + ", author=" + author
				+ ", receiveEditor=" + receiveEditor + ", editorMessage=" + editorMessage + ", authorMessage="
				+ authorMessage + "]";
	}
	
	public static class Deserializer implements JsonDeserializer<Messages>{

		@Override
		public Messages deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
			System.out.println("Deserializing!!!");
			Messages m = new Messages();
			JsonObject jo = json.getAsJsonObject();
			JsonElement je = jo.get("title");
			if (je.isJsonObject()) {
				m.setTitle(context.deserialize(jo.get("title"), Story.class));
			} else {
				Story title = new StoryRepo().getByTitle(context.deserialize(jo.get("title"), String.class));
				m.setTitle(title);
			}
			//Sometimes JSON sends a full object when all I want is a string. This helps to do that.
			if (je.isJsonObject()) {
				m.setFromEditor(context.deserialize(jo.get("fromEditor"), Editor.class));
			} else {
				Editor e = new EditorRepo().getByFirstName(context.deserialize(jo.get("fromEditor"), String.class));
				m.setFromEditor(e);
			}
			//Same thing here
			if (je.isJsonObject()) {
				m.setAuthor(context.deserialize(jo.get("fromAuthor"), Author.class));
			} else {
				Author a = new AuthorRepo().getByFirstName(context.deserialize(jo.get("fromAuthor"), String.class));
				m.setAuthor(a);
			}
			//And same thing here
			if (je.isJsonObject()) {
				m.setReceiveEditor(context.deserialize(jo.get("receiveEditor"), Editor.class));
			} else {
				Editor e = new EditorRepo().getByFirstName(context.deserialize(jo.get("receiveEditor"), String.class));
				m.setReceiveEditor(e);
			}
			m.setEditorMessage(context.deserialize(jo.get("editorMessage"), String.class));
			m.setAuthorMessage(context.deserialize(jo.get("authorMessage"), String.class));
			return m;
		}
	}
	
}
