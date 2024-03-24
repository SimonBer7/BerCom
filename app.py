from flask import Flask, render_template, request, redirect, url_for, session
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
import mysql.connector

app = Flask(__name__)
bcrypt = Bcrypt(app)
mail = Mail(app)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'airportbernard@gmail.com'  # Replace with your SMTP server
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'simon.bernardbe17@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'simonek7'  # Replace with your email password
app.config['MAIL_DEFAULT_SENDER'] = 'simon.bernardbe17@gmail.com'

# Connect to MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bercom"
)

cursor = db.cursor()

@app.route('/', methods=['GET'])
def index_form():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup_form():
    if request.method == 'POST':
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('password2')

        if password != confirm_password:
            alert = "Passwords do not match. Please try again."
            return render_template('signup.html', alert=alert)
        else:
            try:
                cursor.execute("SELECT COUNT(*) FROM user WHERE email = %s", (email,))
                result = cursor.fetchone()
                if result[0] > 0:
                    alert = "Email address already exists. Please use a different email."
                    return render_template('signup.html', alert=alert)
                else:
                    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
                    sql = "INSERT INTO user (last_name, email, password) VALUES (%s, %s, %s)"
                    val = (last_name, email, hashed_password)
                    cursor.execute(sql, val)
                    db.commit()
                    return render_template('login.html')

            except mysql.connector.Error as err:
                alert = f"An error occurred: {err}"
                return render_template('signup.html', alert=alert)

    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login_form():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            sql = "SELECT id, last_name, email, password FROM user WHERE email = %s"
            cursor.execute(sql, (email,))
            user = cursor.fetchone()

            if user:
                if bcrypt.check_password_hash(user[3], password):
                    session['user_id'] = user[0]
                    session['last_name'] = user[1]
                    session['email'] = user[2]
                    return redirect(url_for('index_form'))
                else:
                    alert = "Incorrect email or password. Please try again."
                    return render_template('login.html', alert=alert)
            else:
                alert = "User with this email does not exist. Please sign up first."
                return render_template('login.html', alert=alert)

        except mysql.connector.Error as err:
            return f"An error occurred: {err}"

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index_form'))

@app.route('/about', methods=['GET'])
def about_form():
    return render_template('about.html')

@app.route('/products', methods=['GET'])
def products_form():
    return render_template('products.html')

@app.route('/service', methods=['GET'])
def service_form():
    return render_template('service.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact_form():
    if request.method == 'POST':
        subject = request.form.get('subject')
        message = request.form.get('message')

        try:
            send_email(subject, message)
            return redirect(url_for('index_form'))
        except Exception as e:
            return f"An error occurred while sending the email: {e}"

    return render_template('contact.html')

def send_email(subject, message):
    recipient_email = 'simon.bernardbe17@gmail.com'
    msg = Message(subject, recipients=[recipient_email])
    msg.body = message
    try:
        mail.send(msg)
        return 'Email sent successfully!'
    except Exception as e:
        raise e


if __name__ == '__main__':
    app.run(debug=True)
