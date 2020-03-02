package umm3601.todo;

//import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.databind.node.ObjectNode;
// import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

// import io.javalin.http.BadRequestResponse;
// import io.javalin.http.NotFoundResponse;
import io.javalin.http.Context;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;


/**
* Tests the logic of the TodoController
*
* @throws IOException
*/
public class TodoControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private TodoController todoController;

  private ObjectId samsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(Document.parse("{\n" +
    "                    owner: \"Chris\",\n" +
    "                    status: false,\n" +
    "                    body: \"some text\",\n" +
    "                    category: \"chair\",\n" +
    "                }"));
    testTodos.add(Document.parse("{\n" +
    "                    owner: \"Audrey\",\n" +
    "                    status: true,\n" +
    "                    body: \"another text\",\n" +
    "                    category: \"software design\",\n" +
    "                }"));
    testTodos.add(Document.parse("{\n" +
    "                    owner: \"Johannes\",\n" +
    "                    status: true,\n" +
    "                    body: \"a third text\",\n" +
    "                    category: \"desk\",\n" +
    "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("owner", "Sam")
      .append("status", false)
      .append("body", "no text")
      .append("category", "software design");


    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(Document.parse(sam.toJson()));

    todoController = new TodoController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }



  @Test
  public void GetAllTodos() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("todos").countDocuments(), JavalinJson.fromJson(result, Todo[].class).length);
  }

  @Test
  public void GetTodoWithExistentId() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", testID));
    todoController.getTodo(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo resultTodo = JavalinJson.fromJson(result, Todo.class);

    assertEquals(resultTodo._id, samsId.toHexString());
    assertEquals(resultTodo.owner, "Sam");
  }

  @Test
  public void GetTodoWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      todoController.getTodo(ctx);
    });
  }

  @Test
  public void GetTodoWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      todoController.getTodo(ctx);
    });
  }

  @Test
  public void AddTodo() throws IOException {

    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":true,\n\t\"body\": \"test body\",\n\t\"category\": \"test category\"\n}";

    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    todoController.addNewTodo(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("todos").countDocuments(eq("_id", new ObjectId(id))));

    //verify todo was added to the database and the correct ID
    Document addedTodo = db.getCollection("todos").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedTodo);
    assertEquals("Test Todo", addedTodo.getString("owner"));
    assertEquals(true, addedTodo.getBoolean("status"));
    assertEquals("test body", addedTodo.getString("body"));
    assertEquals("test category", addedTodo.getString("category"));

  }

  @Test
  public void AddInvalidCategoryTodo() throws IOException {
    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":true,\n\t\"body\": \"test body\",\n\t\"category\": \" asjdkfj kljas falskdjf asldjkfa 56sldkfj asdl;kf435j asdlfkja sdfl;kasj flas;j#249\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }


  @Test
  public void AddNoCategoryTodo() throws IOException {
    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":true,\n\t\"body\": \"test body\",\n\t\"category\": \"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }


  @Test
  public void AddInvalidStatusTodo() throws IOException {
    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":\"notABoolean\",\n\t\"body\": \"test body\",\n\t\"category\": \"test category\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  @Test
  public void AddInvalidOwnerTodo() throws IOException {
    String testNewTodo = "{\n\t\"status\":\"jjaskldfj lj asjflajeioj flaksiowut  34 22j3k fdk wiefjw fjak\",\n\t\"body\": \"test body\",\n\t\"category\": \"test category\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  @Test
  public void AddNoOwnerTodo() throws IOException {
    String testNewTodo = "{\n\t\"status\":true,\n\t\"body\": \"test body\",\n\t\"category\": \"test category\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  @Test
  public void AddInvalidBodyTodo() throws IOException {
    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":true,\n\t\"body\": \"test body ajfklajfalsjfiowejf alsf lsjfwioefj lakjgoiuilj klj asg;hiwopaaipwur wejf fjslkjf j345u8972987 89475 vr khfljsf wioeruwp thkjhaskfaeau roiu sdf sd \",\n\t\"category\": \"test category\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  @Test
  public void AddNoBodyTodo() throws IOException {
    String testNewTodo = "{\n\t\"owner\": \"Test Todo\",\n\t\"status\":true,\n\t\"body\":,\n\t\"category\": \"test category\"\n}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/new");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  @Test
  public void GetTodosByCategory() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("category=software design");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Todo todo : JavalinJson.fromJson(result, Todo[].class)) {
      assertEquals("software design", todo.category); // Every todo should be of the software design category
    }
  }

  @Test
  public void GetTodosByOwner() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("owner=Audrey");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Todo todo : JavalinJson.fromJson(result, Todo[].class)) {
      assertEquals("Audrey", todo.owner); // There exists an owner named Audrey
    }
  }

  @Test
  public void NonExistentOwner() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("owner=John");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Todo todo : JavalinJson.fromJson(result, Todo[].class)) {
      assertNotEquals("John", todo.owner); // There exists no owner named John
    }
  }



  @Test
  public void GetTodosByBody() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("body=another text");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Todo todo : JavalinJson.fromJson(result, Todo[].class)) {
      assertEquals("another text", todo.body);
    }
  }

  @Test
  public void NonExistentBody() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("body=a third text exists?");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();

    for (Todo todo : JavalinJson.fromJson(result, Todo[].class)) {
      assertNotEquals("a third text exists?", todo.body); // There exists no body named John
    }
  }


}
