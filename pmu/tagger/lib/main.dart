import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'package:path/path.dart' as p;

void main() {
  if (kIsWeb) {
    databaseFactory = databaseFactoryFfiWeb;
  }
  runApp(const DateTagApp());
}

class DateTagApp extends StatelessWidget {
  const DateTagApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: "Tagger",
        theme: ThemeData(primarySwatch: Colors.blue),
        home: const DateTagScreen());
  }
}

class DateTag {
  final int? id;
  final DateTime date;
  final String tag;

  DateTag({this.id, required this.date, required this.tag});

  Map<String, dynamic> toMap() =>
      {'id': id, 'date': date.millisecondsSinceEpoch, 'tag': tag};

  factory DateTag.fromMap(Map<String, dynamic> map) => DateTag(
      id: map['id'],
      date: DateTime.fromMillisecondsSinceEpoch(map['date']),
      tag: map['tag']);
}

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('date_tags.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = p.join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) => db.execute('''
        CREATE TABLE date_tags(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date INTEGER NOT NULL,
          tag TEXT NOT NULL
        )'''),
    );
  }

  Future<int> insert(DateTag tag) async {
    final db = await database;
    return await db.insert('date_tags', tag.toMap());
  }

  Future<List<DateTag>> getAll() async {
    final db = await database;
    final result = await db.query('date_tags', orderBy: 'date DESC');
    return result.map((map) => DateTag.fromMap(map)).toList();
  }

  Future<int> delete(int id) async {
    final db = await database;
    return await db.delete('date_tags', where: 'id = ?', whereArgs: [id]);
  }

  Future close() async {
    final db = await database;
    db.close();
  }
}

class DateTagScreen extends StatefulWidget {
  const DateTagScreen({super.key});

  @override
  State<StatefulWidget> createState() => _DateTagScreenState();
}

class _DateTagScreenState extends State<DateTagScreen> {
  final DatabaseHelper _db = DatabaseHelper.instance;
  final TextEditingController _controller = TextEditingController();

  DateTime _selectedDate = DateTime.now();
  List<DateTag> _tags = [];

  @override
  void initState() {
    super.initState();
    _loadTags();
  }

  Future<void> _loadTags() async {
    final tags = await _db.getAll();
    setState(() {
      _tags = tags;
    });
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
        context: context,
        initialDate: _selectedDate,
        firstDate: DateTime(2000),
        lastDate: DateTime(2100));

    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _addTag() async {
    if (_controller.text.isEmpty) return;
    await _db.insert(DateTag(date: _selectedDate, tag: _controller.text));
    _controller.clear();
    await _loadTags();
  }

  Future<void> _deleteTag(int id) async {
    await _db.delete(id);
    await _loadTags();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tagger')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                    child: TextField(
                  controller: _controller,
                  decoration: const InputDecoration(
                      labelText: 'Tag', border: OutlineInputBorder()),
                )),
                IconButton(
                  onPressed: _selectDate,
                  icon: const Icon(Icons.calendar_today),
                  tooltip: "Select date",
                ),
                ElevatedButton(
                    onPressed: _addTag,
                    child: Text(DateFormat("MMM dd").format(_selectedDate)))
              ],
            ),
          ),
          Expanded(
              child: ListView.builder(
                  itemCount: _tags.length,
                  itemBuilder: (ctx, i) => ListTile(
                        title: Text(_tags[i].tag),
                        subtitle:
                            Text(DateFormat.yMMMd().format(_tags[i].date)),
                        trailing: IconButton(
                            onPressed: () => _deleteTag(_tags[i].id!),
                            icon: const Icon(
                              Icons.delete,
                              color: Colors.red,
                            )),
                      )))
        ],
      ),
    );
  }
}
