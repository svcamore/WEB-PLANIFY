import React from "react";

const App = () => {
  return (
    <div>
      <title>Planify</title>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #d6defc;
            color: #000;
          }
          a {
            text-decoration: none;
          }
          header {
            background-color: #f9f9ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 24px;
          }
          .logo {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .logo img {
            width: 32px;
            height: 32px;
          }
          .logo-text {
            font-weight: 700;
            font-size: 18px;
            color: #000;
          }
          nav {
            display: flex;
            align-items: center;
            gap: 16px;
            font-weight: 400;
            font-size: 14px;
            color: #000;
          }
          nav a {
            color: #000;
          }
          nav a.signup {
            font-weight: 600;
            font-size: 14px;
            color: #3b5de7;
            border: 1.5px solid #3b5de7;
            border-radius: 4px;
            padding: 6px 12px;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          nav a.signup:hover,
          nav a.signup:focus {
            background-color: #3b5de7;
            color: #fff;
          }
          main {
            max-width: 900px;
            margin: 48px auto 64px;
            padding: 0 24px;
            text-align: center;
          }
          main h1 {
            font-weight: 700;
            font-size: 28px;
            margin: 0 0 8px;
          }
          main h1 .blue {
            color: #3b5de7;
          }
          main p {
            font-weight: 400;
            font-size: 13px;
            color: #7a7a8c;
            margin: 0 0 32px;
          }
          .btn-get-started {
            background: linear-gradient(90deg, #3b5de7 0%, #2f4edb 100%);
            border: none;
            border-radius: 6px;
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            padding: 10px 28px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(59, 93, 231, 0.5);
            transition: background 0.3s ease;
          }
          .btn-get-started:hover {
            background: linear-gradient(90deg, #2f4edb 0%, #3b5de7 100%);
          }
          .features-title {
            margin: 56px 0 32px;
            font-weight: 700;
            font-size: 16px;
          }
          .features-title .blue {
            color: #3b5de7;
          }
          .features-container {
            display: flex;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
          }
          .feature-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            width: 260px;
            padding: 20px 24px 24px;
            text-align: left;
          }
          .feature-icon {
            font-size: 24px;
            color: #3b5de7;
            margin-bottom: 12px;
          }
          .feature-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .feature-list {
            margin: 0;
            padding-left: 16px;
            font-weight: 400;
            font-size: 12px;
            color: #7a7a8c;
            list-style-type: disc;
          }
          .feature-list li {
            margin-bottom: 4px;
          }
          .why-section {
            background: #fff;
            padding: 60px 24px;
          }
          .why-container {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            align-items: center;
            justify-content: center;
          }
          .image-wrapper {
            flex: 1 1 45%;
            display: flex;
            justify-content: center;
          }
          .image-wrapper img {
            max-width: 100%;
            height: auto;
          }
          .content {
            flex: 1 1 45%;
          }
          .content h2 {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 24px;
          }
          .content h2 span {
            color: #2563eb;
          }
          .list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .list-item {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
          }
          .icon-circle {
            min-width: 20px;
            height: 20px;
            background: #2563eb;
            color: white;
            font-size: 12px;
            font-weight: 600;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
          }
          .text-content strong {
            font-weight: 600;
            font-size: 14px;
            color: #0f172a;
            display: block;
            margin-bottom: 4px;
          }
          .text-content p {
            margin: 0;
            font-size: 12px;
            line-height: 1.4;
            color: #64748b;
          }
          .container1 {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px 15px 60px;
            text-align: center;
          }
          .testimonial-quote {
            font-size: 13px;
            line-height: 1.4;
            color: #000;
            max-width: 600px;
            margin: 0 auto 20px;
          }
          .testimonial-quote a {
            color: #2a5afc;
            text-decoration: none;
            font-weight: 600;
          }
          .testimonial-quote a:hover,
          .testimonial-quote a:focus {
            text-decoration: underline;
          }
          .testimonial-author {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 11px;
            color: #555;
            margin-bottom: 50px;
          }
          .testimonial-author img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-bottom: 6px;
          }
          .testimonial-author strong {
            font-weight: 700;
            color: #000;
          }
          .headline {
            font-weight: 700;
            font-size: 24px;
            margin-bottom: 6px;
            line-height: 1.2;
          }
          .headline .blue {
            color: #003bff;
          }
          .subheadline {
            font-weight: 400;
            font-size: 13px;
            color: #7a7a7a;
            margin-bottom: 40px;
          }
          .features {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 60px;
            
          }
          .feature-box {
            background: #c7d3ff;
            border-radius: 8px;
            padding: 20px 25px;
            width: 160px;
            text-align: left;
            box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .feature-box strong {
            display: block;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 12px;
          }
          .feature-icons {
            display: flex;
            gap: 8px;
          }
          .feature-icons img {
            width: 28px;
            height: 28px;
            object-fit: contain;
          }
          .section-title {
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 6px;
          }
          .section-subtitle {
            font-weight: 400;
            font-size: 13px;
            color: #7a7a7a;
            margin-bottom: 30px;
          }
          .reviews {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }
          .review-card {
            background: #c7d3ff;
            border-radius: 8px;
            padding: 20px 20px 25px;
            width: 260px;
            box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .review-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .review-header {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .review-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }
          .review-name {
            font-weight: 700;
            font-size: 14px;
            color: #000;
          }
          .review-rating {
            margin-left: auto;
            color: #f5c518;
            font-size: 14px;
          }
          .review-text {
            font-size: 11px;
            color: #333;
            line-height: 1.3;
          }
          .top-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
            border-radius: 8px;
          }
          .top-text {
            flex: 1;
            padding-right: 20px;
          }
          .top-text h1 {
            font-size: 2rem;
            margin: 0 0 10px 0;
            font-weight: 700;
            color: #222;
          }
          .top-text p {
            font-size: 1rem;
            color: #555;
            margin: 0;
          }
          .top-image img {
            width: 280px;
            height: auto;
            border-radius: 8px;
            object-fit: contain;
            display: block;
          }
          @media (max-width: 600px) {
            .top-section {
              flex-direction: column;
              text-align: center;
            }
            .top-text {
              padding-right: 0;
              margin-bottom: 20px;
            }
            .top-image img {
              width: 100%;
              max-width: 300px;
            }
          }
          @media (max-width: 720px) {
            header {
              flex-wrap: wrap;
              gap: 12px;
              padding: 12px 16px;
            }
            nav {
              gap: 12px;
              font-size: 13px;
            }
            main {
              margin: 32px auto 48px;
            }
            .features-container {
              flex-direction: column;
              align-items: center;
            }
            .feature-card {
              width: 100%;
              max-width: 320px;
            }
            .why-container {
              flex-direction: column;
            }
            .content {
              text-align: center;
            }
            .list-item {
              justify-content: center;
              text-align: left;
            }
            .features {
              justify-content: center;
            }
            .feature-box {
              width: 140px;
              padding: 15px 20px;
            }
            .reviews {
              flex-direction: column;
              align-items: center;
            }
            .review-card {
              width: 100%;
              max-width: 320px;
            }
            .footer-links {
              flex-direction: column;
              gap: 12px;
            }
          }
        `}
      </style>
      <header>
        <a className="logo" href="#">
          <img
            src="/logo%20planify%20new.png"
            alt="Planify Logo"
            width="36"
            height="36"
          />

          <span className="logo-text">Planify</span>
        </a>
        <nav>
          <a href="#">About Us</a>
          <a href="/login">Sign In</a>
          <a className="signup" href="/sign_up">
            Sign Up For Free
          </a>
        </nav>
      </header>

      <main>
        <h1>
          Welcome to <span className="blue">Planify</span>
        </h1>
        <p>
          you can focus on what matters while we remind you of deadlines,
          priorities, and daily goals.
        </p>
        <button
          className="btn-get-started"
          onClick={() => (window.location.href = "/login")}
        >
          Get Started
        </button>

        <h2 className="features-title">
          We Provide <span className="blue">The Best</span> Features
        </h2>
        <section className="features-container">
          <article className="feature-card">
            <i className="fab fa-telegram feature-icon"></i>
            <h3 className="feature-title">Share Workbook</h3>
            <ul className="feature-list">
              <li>Real Time Collaboration</li>
              <li>Multi-user Access</li>
              <li>Automatic Synchronization</li>
            </ul>
          </article>
          <article className="feature-card">
            <i className="fas fa-bell feature-icon"></i>
            <h3 className="feature-title">Notification</h3>
            <ul className="feature-list">
              <li>Multichannel Reminders</li>
              <li>Time Customization</li>
              <li>Priority and Category Integration With Calendar</li>
            </ul>
          </article>
          <article className="feature-card">
            <i className="fas fa-calendar-alt feature-icon"></i>
            <h3 className="feature-title">Board & Task Notes</h3>
            <ul className="feature-list">
              <li>Quick Search and Filters</li>
              <li>Custom Templates</li>
              <li>Structured Task Notes</li>
              <li>Simple Drag-and-Drop</li>
            </ul>
          </article>
        </section>
      </main>

      <section className="why-section">
        <div className="why-container">
          <div className="image-wrapper">
            <img
              src="https://storage.googleapis.com/a1aa/image/3d944cd8-0ae2-4d9f-bcfe-29f4e4e460df.jpg"
              alt="Person thinking with question marks"
            />
          </div>
          <div className="content">
            <h2>
              Why <span>Planify?</span>
            </h2>
            <ul className="list">
              <li className="list-item">
                <div className="icon-circle">1</div>
                <div className="text-content">
                  <strong>Record and organize tasks</strong>
                  <p>
                    add tasks, group them, and organize schedule with a simple
                    interface
                  </p>
                </div>
              </li>
              <li className="list-item">
                <div className="icon-circle">2</div>
                <div className="text-content">
                  <strong>Smart reminder you won't miss</strong>
                  <p>
                    set up notification via WhatsApp or push notification.
                    Planify makes sure you're always on time!
                  </p>
                </div>
              </li>
              <li className="list-item">
                <div className="icon-circle">3</div>
                <div className="text-content">
                  <strong>
                    Calendar integration and multi-devices synchronization
                  </strong>
                  <p>
                    access your schedule everywhere, anytime. Planify is
                    available on the web, smartphones, laptop, or tablet!
                  </p>
                </div>
              </li>
              <li className="list-item">
                <div className="icon-circle">4</div>
                <div className="text-content">
                  <strong>Prioritize the important</strong>
                  <p>
                    you can set priorities label and break large task into more
                    manageable sub-task
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container1" role="main">
        <p aria-label="Testimonial quote" className="testimonial-quote">
          "Balancing classes, assignments, and part-time work used to be
          chaotic. With
          <a
            href="https://planify.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            {" "}
            Planify{" "}
          </a>
          , I can track everything in one place. The reminders and flexible
          layout help me stay focused and less stressed. Super helpful!"
        </p>
        <div aria-label="Testimonial author" className="testimonial-author">
          <img
            alt="Profile picture of Daniel S."
            height="28"
            src="https://storage.googleapis.com/a1aa/image/5af45c48-03d5-4f34-f8d4-b717f8f323bd.jpg"
            width="28"
          />
          <strong>Daniel S.</strong>
          <span>University Student</span>
        </div>
        <h1 className="headline">
          <span className="blue">One App</span> to{" "}
          <strong>Replace All of Them</strong>
        </h1>
        <p className="subheadline">
          No more switching tabs. Just you and your goals
        </p>
        <section aria-label="Features" className="features">
          <div
            aria-labelledby="tasks-label"
            className="feature-box"
            role="region"
          >
            <strong id="tasks-label">Tasks</strong>
            <div aria-hidden="true" className="feature-icons">
              <img
                alt="Tasks app icon Trello style blue and white"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/e90559f5-0f21-4aaa-ad03-49515bb03cfa.jpg"
                width="28"
              />
              <img
                alt="Tasks app icon red with white checkmark"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/7406ced5-350a-46e2-eb6b-705465979bf6.jpg"
                width="28"
              />
              <img
                alt="Tasks app icon blue circle with white checkmark"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/086deabc-4831-4325-5c65-53df30d9487c.jpg"
                width="28"
              />
            </div>
          </div>
          <div
            aria-labelledby="notes-label"
            className="feature-box"
            role="region"
          >
            <strong id="notes-label">Notes</strong>
            <div aria-hidden="true" className="feature-icons">
              <img
                alt="Notes app icon blue swirl"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/cb282e26-6b6f-47ed-f3c2-ecc8889a7394.jpg"
                width="28"
              />
              <img
                alt="Notes app icon purple with white N"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/d6e5c6f8-035f-4eed-78c1-e1d4d5c06abb.jpg"
                width="28"
              />
              <img
                alt="Notes app icon green elephant"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/dea75c8a-e8e5-4fe8-b528-42874fa77919.jpg"
                width="28"
              />
            </div>
          </div>
          <div
            aria-labelledby="projects-label"
            className="feature-box"
            role="region"
          >
            <strong id="projects-label">Projects</strong>
            <div aria-hidden="true" className="feature-icons">
              <img
                alt="Projects app icon black N on white"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/b12dff42-faa9-4dd0-2a90-8af3444b670f.jpg"
                width="28"
              />
              <img
                alt="Projects app icon green P"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/be257d1d-58dc-48fe-d177-297ef6ed4421.jpg"
                width="28"
              />
              <img
                alt="Projects app icon colorful squares"
                height="28"
                src="https://storage.googleapis.com/a1aa/image/1e1f00f6-93fa-42e0-5549-1ab8e57a3417.jpg"
                width="28"
              />
            </div>
          </div>
        </section>
        <h2 className="section-title">What Users Say!</h2>
        <p className="section-subtitle">
          Real stories. Real results. Straight from our users!
        </p>
        <section aria-label="User  reviews" className="reviews">
          <article
            aria-describedby="review1-text"
            aria-labelledby="review1-name"
            className="review-card"
            role="article"
          >
            <div className="review-header">
              <img
                alt="Profile picture of Hana L."
                className="review-avatar"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/88fa32bb-d60d-433a-13e9-84261dcb907b.jpg"
                width="32"
              />
              <strong className="review-name" id="review1-name">
                Hana L.
              </strong>
              <div aria-label="5 star rating" className="review-rating">
                ★★★★★
              </div>
            </div>
            <p className="review-text" id="review1-text">
              Before Planify, I kept forgetting homework and study sessions. Now
              I can plan my week, set goals, and even make time for my art
              projects. It makes school life so much easier!
            </p>
          </article>
          <article
            aria-describedby="review2-text"
            aria-labelledby="review2-name"
            className="review-card"
            role="article"
          >
            <div className="review-header">
              <img
                alt="Profile picture of Reza F."
                className="review-avatar"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/dc926784-2d18-40f0-fbb1-7ea521b869c4.jpg"
                width="32"
              />
              <strong className="review-name" id="review2-name">
                Reza F.
              </strong>
              <div aria-label="5 star rating" className="review-rating">
                ★★★★★
              </div>
            </div>
            <p className="review-text" id="review2-text">
              The clean layout and daily reminders keep me organized and
              motivated. It's seriously a game-changer.
            </p>
          </article>
          <article
            aria-describedby="review3-text"
            aria-labelledby="review3-name"
            className="review-card"
            role="article"
          >
            <div className="review-header">
              <img
                alt="Profile picture of Mira B."
                className="review-avatar"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/1dd306f6-d8f1-4454-0ecd-1e50fbda66d9.jpg"
                width="32"
              />
              <strong className="review-name" id="review3-name">
                Mira B.
              </strong>
              <div aria-label="5 star rating" className="review-rating">
                ★★★★★
              </div>
            </div>
            <p className="review-text" id="review3-text">
              As a freshman, juggling my studies and my passions was
              overwhelming. Planify helped me break down my tasks and stay ahead
              of deadlines. I also love the motivating interface and clean
              design!
            </p>
          </article>
        </section>
      </div>

      <section aria-label="Get Started Section" className="top-section">
        <div className="top-text">
          <h1>
            <strong style={{ color: "#0033cc" }}>Get Started</strong> For Free
          </h1>
          <p>Upgrade anytime for more powerful features!</p>
        </div>
        <div className="top-image">
          <img
            alt="Illustration of a person standing next to a large calendar with a clock, pencil, apple, and books on a light background"
            src="https://storage.googleapis.com/a1aa/image/e93e3107-d623-4f26-e02e-67ce69c53b10.jpg"
          />
        </div>
      </section>

      <footer
        style={{
          backgroundColor: "#2e2e3a",
          color: "#fff",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div
            style={{
              flex: "1 1 300px",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              minWidth: "260px",
            }}
          >
            <div className="icon-container" aria-hidden="true">
              <img
                src="/logo%20planify%20new.png"
                alt="Planify Logo"
                width="36"
                height="36"
              />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>
                Planify
              </h2>
              <p style={{ marginTop: "8px", fontSize: "14px", color: "#ccc" }}>
                Planify is a smart, user-friendly task management and
                productivity platform designed to help individuals and teams
                organize their lives, meet deadlines, and achieve goals
                efficiently.
                <br />
                <br />
                Combining intuitive tools with seamless integration across
                devices, Planify empowers users to turn plans into actionable
                steps while minimizing stress and maximizing productivity.
              </p>
            </div>
          </div>

          <div
            style={{
              flex: "2 1 600px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "30px",
              minWidth: "260px",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Products
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  color: "#ccc",
                  fontSize: "14px",
                }}
              >
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Daily Planner
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    To-Do List
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Goal Tracker
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Calendar Sync
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Reminders
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Premium Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Resources
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  color: "#ccc",
                  fontSize: "14px",
                }}
              >
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    Productivity Tips
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                    User Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Contact Us
              </h3>
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
              >
                <a href="#" aria-label="Email" style={{ color: "#ccc" }}>
                  <i className="fas fa-envelope"></i>
                </a>
                <a href="#" aria-label="Twitter" style={{ color: "#ccc" }}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="Instagram" style={{ color: "#ccc" }}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="LinkedIn" style={{ color: "#ccc" }}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <button
                style={{
                  backgroundColor: "#3b3b4d",
                  color: "#fff",
                  border: "1px solid #555",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                English <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
